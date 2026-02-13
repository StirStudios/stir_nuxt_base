import { setTimeout as delay } from 'node:timers/promises'
import { spawn } from 'node:child_process'

const host = process.env.SMOKE_HOST || '127.0.0.1'
const port = Number(process.env.SMOKE_PORT || 4310)
const smokePath = process.env.SMOKE_PATH || '/api/health'
const baseUrl = `http://${host}:${port}`
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 60000)
const requestTimeoutMs = Number(process.env.SMOKE_REQUEST_TIMEOUT_MS || 4000)

async function fetchWithTimeout(url) {
  return fetch(url, {
    signal: AbortSignal.timeout(requestTimeoutMs),
  })
}

async function waitForServer() {
  const started = Date.now()

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetchWithTimeout(`${baseUrl}${smokePath}`)
      if (response.status < 500) return
    } catch {
      // Keep polling until timeout.
    }

    await delay(750)
  }

  throw new Error(`Timed out waiting for preview server at ${baseUrl}`)
}

async function runSmoke() {
  const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
  const child = spawn(
    pnpmCommand,
    ['preview', '--port', String(port)],
    {
      stdio: 'pipe',
      env: process.env,
    },
  )

  let output = ''
  child.stdout.on('data', (chunk) => {
    output += chunk.toString()
  })
  child.stderr.on('data', (chunk) => {
    output += chunk.toString()
  })

  let childError = null
  let childExited = false
  let childExitCode = null
  child.on('error', (error) => {
    childError = error
  })
  child.on('exit', (code) => {
    childExited = true
    childExitCode = code
  })

  try {
    await waitForServer()

    if (childError) {
      throw new Error(`Preview failed to start: ${String(childError)}`)
    }
    if (childExited && childExitCode !== 0) {
      throw new Error(
        `Preview exited early with code ${String(childExitCode)}\n${output}`,
      )
    }

    const response = await fetchWithTimeout(`${baseUrl}${smokePath}`)
    if (response.status >= 500) {
      throw new Error(
        `Expected ${smokePath} to respond below 500 but got ${response.status}`,
      )
    }

    const body = await response.text()
    if (body.trim().length === 0) {
      throw new Error(`Smoke check failed: ${smokePath} returned an empty body`)
    }
  } catch (error) {
    const details =
      output.trim().length > 0 ? `\n[preview output]\n${output}` : ''
    throw new Error(`${String(error)}${details}`)
  } finally {
    child.kill('SIGTERM')
    await delay(300)
    if (!child.killed) child.kill('SIGKILL')
  }

  if (output.length > 0 && process.env.SMOKE_DEBUG === '1') {
    process.stdout.write(output)
  }
}

runSmoke().catch((error) => {
  console.error('[smoke] failed:', error)
  process.exit(1)
})
