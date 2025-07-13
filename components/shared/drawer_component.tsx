import {
	type DrawerContentComponentProps,
	DrawerContentScrollView, DrawerItem,
} from "@react-navigation/drawer";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DrawerComponent = (
	props: DrawerContentComponentProps,
): React.JSX.Element => {
	const navigation = useNavigation();
	return (
		<DrawerContentScrollView {...props}>
		{/* Existant */}
      <DrawerItem label="Profile" onPress={() => navigation.navigate('Profile')} />
      <DrawerItem label="Cart" onPress={() => navigation.navigate('Cart')} />
		</DrawerContentScrollView>
	);
};

export default DrawerComponent;
