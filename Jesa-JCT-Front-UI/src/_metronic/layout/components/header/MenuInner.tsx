import { MenuItem } from "./MenuItem";
import { MenuInnerWithSub } from "./MenuInnerWithSub";

export function MenuInner() {
  return (
    <>
      <MenuItem title="Home" to="/home" />
      {/* Add your custom menu items here */}
      
      {/* Example submenu - uncomment to use */}
      {/* <MenuInnerWithSub
        title="Pages"
        to="/pages"
        hasArrow={true}
        menuPlacement="bottom-start"
        menuTrigger={`{default:'click', lg: 'hover'}`}
      >
        <MenuItem icon="abstract-26" to="/page1" title="Page 1" />
        <MenuItem icon="abstract-26" to="/page2" title="Page 2" />
      </MenuInnerWithSub> */}
    </>
  );
}
