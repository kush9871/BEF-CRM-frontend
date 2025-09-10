'use client';

// import node module libraries
import { useState } from 'react';

// import styles
import 'styles/theme.scss';

// import components
import NavbarVertical from '/layouts/navbars/NavbarVertical';
import NavbarTop from '/layouts/navbars/NavbarTop';
import RoleGuard from '../../../components/RoleGuard'

export default function DashboardLayout({ children }) {
	const [showMenu, setShowMenu] = useState(true);
	const toggleMenu = () => setShowMenu(!showMenu);

	return (
		<RoleGuard>
			<div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
				<div className="navbar-vertical navbar navbar-sidebar ">
					<NavbarVertical
						showMenu={showMenu}
						onClick={(value) => setShowMenu(value)}
					/>
				</div>
				<div id="page-content">
					<div className="header">
						<NavbarTop
							data={{
								showMenu: showMenu,
								SidebarToggleMenu: toggleMenu
							}}
						/>
					</div>
					{children}
				</div>
			</div>
		</RoleGuard>
	);
}
