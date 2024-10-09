import { useState } from "react";
import { Divider, IconButton, Menu } from "react-native-paper";

type TemplateMenuProps = {
  editTemplate?: () => void;
  deleteTemplate?: () => void;
};

export default function TemplateMenu({ editTemplate, deleteTemplate }: TemplateMenuProps) {
  const [visible, setVisible] = useState(false);
  const closeMenu = () => setVisible(false);
  const openMenu = () => setVisible(true);

/*   const handleViewTemplate = () => {
    viewTemplate();
    closeMenu(); // Close the menu after viewing the template
  }; */

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          icon="dots-horizontal"
          onPress={openMenu}
        ></IconButton>
      }
    >
      <Menu.Item onPress={editTemplate} leadingIcon="pen" title="Edit" />
      <Divider />
      <Menu.Item onPress={deleteTemplate} leadingIcon="trash-can" title="Delete" />
    </Menu>
  );
}