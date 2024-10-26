export interface TabsProps {
  tabs: {
    primary: TabItemProps[]
  }
}

export interface TabItemProps {
  url: string
  label: string
  active: boolean
}

export interface CrumbProps {
  crumbs?: CrumbItemProps[]
}

export interface CrumbItemProps {
  url: string
  label: string
}
