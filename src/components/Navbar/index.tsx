import React from 'react'
import { Collapse, Navbar as RNavbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { logout } from '#/store/actions/user'
import { connect } from 'react-redux'
import './index.scss'

const NAVBAR_LINKS = [
  {
    url: '/cabinet',
    title: 'My Templates',
    icon: 'fas fa-th-list'
  },
  {
    url: '/cabinet/history',
    title: 'History',
    icon: 'fas fa-history'
  },
  {
    url: '/cabinet/settings',
    title: 'Settings',
    icon: 'fas fa-cogs'
  }
]

interface NavbarProps extends RouteComponentProps {
  logout: () => Promise<any>
  open: boolean
  toggleOpen: () => void
}

const Navbar = (props: NavbarProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const toggle = () => setIsOpen(!isOpen)

  const handleSubmit = () => {
    props.logout()
  }

  const { pathname } = props.location
  const renderedLinks = NAVBAR_LINKS.map((link: { url: string; title: string; icon: string }) => (
    <NavItem key={link.url}>
      <NavLink tag={Link} to={link.url} active={pathname === link.url}>
        <i className={link.icon} />
        <span className="ml-2">{link.title}</span>
      </NavLink>
    </NavItem>
  ))

  const navbarClassname = props.open ? 'navbar-open navbar' : 'navbar-hidden navbar'

  return (
    <div className={navbarClassname}>
      <RNavbar color="white" light expand="md">
        <div className="container">
          <NavbarBrand tag={Link} to="/cabinet">
            <img
              src="https://avatars3.githubusercontent.com/u/54907581?s=200&v=4"
              alt="logotype"
              width="50"
              height="50"
            />
            <span className="ml-2">MUCPoll</span>
          </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              {renderedLinks}
            </Nav>
            <Nav navbar>
              <NavItem>
                <NavLink tag={Link} to="/auth" onClick={handleSubmit}>
                  <span>Logout</span>
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </div>

        <div className="triangle-down center">
          <p>
            <i className="fas fa-chevron-down fa-2x isDown" onClick={props.toggleOpen}></i>
          </p>
        </div>
      </RNavbar>
    </div>
  )
}

export default withRouter(connect(null, { logout })(Navbar))
