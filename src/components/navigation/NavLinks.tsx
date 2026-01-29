import React, { type ReactNode, type ComponentType } from 'react';
import { Nav } from 'react-bootstrap';

export type NavItem = {
  path: string;
  title: string;
  children?: NavItem[];
};

export type BreadcrumbItem = {
  path: string;
  title: string;
};

type LinkComponentProps = {
  to: string;
  children: ReactNode;
  className?: string;
};

export type NavLinksProps = {
  items: NavItem[];
  pathname: string;
  LinkComponent: ComponentType<LinkComponentProps>;
  onClick?: () => void;
  renderBreadcrumb?: (breadcrumbs: BreadcrumbItem[]) => ReactNode;
  indent?: number;
};

export const NavLinks = ({
  items,
  pathname,
  LinkComponent,
  onClick,
  renderBreadcrumb,
  indent = 20,
}: NavLinksProps) => {
  return (
    <NavLinksInternal
      items={items}
      pathname={pathname}
      LinkComponent={LinkComponent}
      onClick={onClick}
      renderBreadcrumb={renderBreadcrumb}
      indent={indent}
      pathRoot=""
      breadcrumbTrail={[]}
    />
  );
};

type NavLinksInternalProps = NavLinksProps & {
  pathRoot: string;
  breadcrumbTrail: BreadcrumbItem[];
};

const NavLinksInternal = ({
  items,
  pathname,
  LinkComponent,
  onClick,
  renderBreadcrumb,
  indent,
  pathRoot,
  breadcrumbTrail,
}: NavLinksInternalProps) => {
  return (
    <>
      {items.map((item, key) => {
        const { path, title, children } = item;

        const fullPath = `${pathRoot}/${path}`.replace(/\/+/g, '/');
        const isActive = pathname === fullPath || pathname.startsWith(`${fullPath}/`);
        const isExactMatch = pathname === fullPath;

        const newBreadcrumbTrail: BreadcrumbItem[] = [
          ...breadcrumbTrail,
          { path: fullPath, title },
        ];

        return (
          <div key={fullPath}>
            <Nav.Item onClick={onClick}>
              <LinkComponent to={fullPath} className="nav-link">
                {title}
              </LinkComponent>
            </Nav.Item>

            {children && isActive && (
              <div style={{ marginLeft: `${indent}px` }}>
                <NavLinksInternal
                  items={children}
                  pathname={pathname}
                  LinkComponent={LinkComponent}
                  onClick={onClick}
                  renderBreadcrumb={renderBreadcrumb}
                  indent={indent}
                  pathRoot={fullPath}
                  breadcrumbTrail={newBreadcrumbTrail}
                />
              </div>
            )}

            {renderBreadcrumb && isExactMatch && renderBreadcrumb(newBreadcrumbTrail)}
          </div>
        );
      })}
    </>
  );
};

export default NavLinks;
