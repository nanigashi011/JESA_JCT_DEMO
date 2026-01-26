
import React from 'react'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'

export function AsideMenuMain() {
  return (
    <>
      {/* Project Review & Monitoring */}
      <AsideMenuItemWithSub
        to='/project-review'
        title='Project Review & Monitoring'
        fontIcon='flaticon-rocket fs-1'
      >
        <AsideMenuItem to='/project-review/project-info' title='Project Information Sheet' hasBullet={true} />
        <AsideMenuItem to='/project-review/executive-summary' title='Executive Summary' hasBullet={true} />
        <AsideMenuItem to='/project-review/traffic-light' title='Traffic Light Reports' hasBullet={true} />
      </AsideMenuItemWithSub>

      {/* Engineering */}
      <AsideMenuItemWithSub
        to='/engineering'
        title='Engineering'
        fontIcon='flaticon-engineering fs-1'
      >
        <AsideMenuItem to='/engineering/progress' title='Progress' hasBullet={true} />
        <AsideMenuItem to='/engineering/deliverables' title='Master Deliverables List' hasBullet={true} />
        <AsideMenuItem to='/engineering/dashboard' title='Documents dashboard' hasBullet={true} />
      </AsideMenuItemWithSub>

      {/* Procurement */}
      <AsideMenuItemWithSub
        to='/procurement'
        title='Procurement'
        fontIcon='flaticon-procurement fs-1'
      >
        <AsideMenuItem to='/procurement/progress' title='Progress' hasBullet={true} />
        <AsideMenuItem to='/procurement/preaward' title='Preaward' hasBullet={true} />
        <AsideMenuItem to='/procurement/postaward' title='Postaward' hasBullet={true} />
        <AsideMenuItem to='/procurement/vendor-scoring' title='Vendor performance scoring' hasBullet={true} />
      </AsideMenuItemWithSub>

      {/* Construction */}
      <AsideMenuItemWithSub
        to='/construction'
        title='Construction'
        fontIcon='flaticon-crane fs-1'
      >
        <AsideMenuItem to='/construction/progress' title='Progress' hasBullet={true} />
        <AsideMenuItem to='/construction/workface' title='Workface planning' hasBullet={true} />
        <AsideMenuItem to='/construction/qc-dashboard' title='QC dashboard' hasBullet={true} />
        <AsideMenuItem to='/construction/crr' title='CRR' hasBullet={true} />
      </AsideMenuItemWithSub>

      {/* Project Control */}
      <AsideMenuItemWithSub
        to='/project-control'
        title='Project control'
        fontIcon='flaticon-money-management fs-1'
      >
        <AsideMenuItem to='/project-control/cost' title='Cost control and financials' hasBullet={true} />
        <AsideMenuItem to='/project-control/planning' title='Planning look ahead' hasBullet={true} />
      </AsideMenuItemWithSub>

      {/* Assurance */}
      <AsideMenuItemWithSub
        to='/assurance'
        title='Assurance'
        fontIcon='flaticon-star fs-1'
      >
        <AsideMenuItem to='/assurance/quality' title='Quality assurance' hasBullet={true} />
        <AsideMenuItem to='/assurance/hse' title='HSE' hasBullet={true} />
      </AsideMenuItemWithSub>

      {/* Reality View */}
      <AsideMenuItemWithSub
        to='/reality-view'
        title='Reality view'
        fontIcon='flaticon-cube fs-1'
      >
        <AsideMenuItem to='/reality-view/cctv' title='Visit my site (CCTV)' hasBullet={true} />
        <AsideMenuItem to='/reality-view/3d' title='3D' hasBullet={true} />
        <AsideMenuItem to='/reality-view/4d' title='4D' hasBullet={true} />
        <AsideMenuItem to='/reality-view/drone' title='Drone' hasBullet={true} />
      </AsideMenuItemWithSub>

      {/* Client Relationship Management */}
      <AsideMenuItem
        to='/client-relationship'
        title='Client relationship management'
        fontIcon='flaticon-trust fs-1'
      />

      {/* Contractor Relationship Management */}
      <AsideMenuItem
        to='/contractor-relationship'
        title='Contractor relationship management'
        fontIcon='flaticon-engineer fs-1'
      />

      {/* My Work Space */}
      <AsideMenuItemWithSub
        to='/workspace'
        title='My work space'
        fontIcon='flaticon-briefcase fs-1'
      >
        <AsideMenuItem to='/workspace/support' title='Support request' hasBullet={true} />
        <AsideMenuItem to='/workspace/actions' title='Actions log' hasBullet={true} />
        <AsideMenuItem to='/workspace/alerts' title='Alerts report' hasBullet={true} />
      </AsideMenuItemWithSub>
    </>
  )
}
