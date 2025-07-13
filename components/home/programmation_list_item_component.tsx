
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { colors, fonts } from "../../constants/design_constants";
import type Artist from "../../models/artist";
import type ProgrammationListItemProps from "../../models/props/programmation_list_item_props";
import ArtistApiService from "../../services/artist_api_service";
import DateUtilsService from "../../services/date_utils_service";
import StringUtilsService from "../../services/string_utils_service";

const ProgrammationListItemComponent = ({
	programme,
}: ProgrammationListItemProps): React.JSX.Element => {
	const [artist, setArtist] = useState<Artist | null>(null);
	const [isFavorite, setIsFavorite] = useState<boolean>(false);

	const setFavorite = useCallback(async () => {
		const favoritesRaw = await AsyncStorage.getItem("favorites");
		const favorites: number[] = favoritesRaw ? JSON.parse(favoritesRaw) : [];

		if (artist && favorites.includes(artist.id)) {
			setIsFavorite(true);
		}
	}, [artist]);

	const handleFavorite = async () => {
		setIsFavorite(!isFavorite);

		const favoritesRaw = await AsyncStorage.getItem("favorites");
		const favorites: number[] = favoritesRaw ? JSON.parse(favoritesRaw) : [];

		if (!artist) return;

		if (!favorites.includes(artist.id)) {
			favorites.push(artist.id);
		} else {
			const index = favorites.indexOf(artist.id);
			if (index !== -1) favorites.splice(index, 1);
		}

		await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
	};

	useEffect(() => {
		if (!programme?.artist?.slug) return;

		ArtistApiService
			.getArtistBySlug(programme.artist.slug)
			.then((data) => {
				setArtist(data as Artist);
			});
	}, [programme]);

	// Protection contre les données incomplètes
	if (!programme?.artist || !programme?.day) {
		return <Text style={{ padding: 10 }}>Chargement des données...</Text>;
	}

	const fullDate = new DateUtilsService().getFullDate(programme.day.date);

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={{
					...styles.iconBtn,
					backgroundColor: isFavorite ? colors.ternary : "rgba(0 0 0 / 0.2)",
				}}
				onPress={handleFavorite}
			>
				<Feather name="heart" style={styles.icon} />
			</TouchableOpacity>

			<TouchableWithoutFeedback
				onPress={() => router.push(`/artist/${programme.artist.slug}`)}
			>
				<View style={styles.innerContainer}>
					{programme.artist.poster ? (
						<Image
							source={`http://192.168.1.177:3000/images/artists/${programme.artist.poster}`}
							style={styles.img}
						/>
					) : (
						<View style={[styles.img, { backgroundColor: "#ccc", justifyContent: "center", alignItems: "center" }]}>
							<Text style={{ fontSize: 10 }}>Pas d’image</Text>
						</View>
					)}

					<Text style={styles.artistName}>
						{programme.artist.name
							? new StringUtilsService().getTextOverflow(programme.artist.name, 12)
							: "Nom inconnu"}
					</Text>

					<View style={styles.musicTypeContainer}>
						<Ionicons name="pricetag-outline" />
						<Text style={styles.musicType}>
							{artist?.music_type?.name || "Genre inconnu"}
						</Text>
					</View>

					<View style={styles.dateContainer}>
						<Feather name="calendar" />
						<Text style={styles.date}>
							{fullDate.dayNameShort}. {fullDate.month}/{fullDate.month}
						</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
};


export default ProgrammationListItemComponent;

const styles = StyleSheet.create({
	container: {
		marginInlineEnd: 15,
	},
	iconBtn: {
		width: 30,
		height: 30,
		borderRadius: "50%",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 5,
		right: 10,
		zIndex: 1,
	},
	icon: {
		color: "white",
		fontSize: 15,
	},
	innerContainer: {
		width: 135,
		backgroundColor: "white",
		padding: 15,
	},
	img: {
		width: 90,
		height: 90,
		borderRadius: 45,
		alignSelf: "center",
	},
	artistName: {
		fontFamily: fonts.subtitle,
		marginBlock: 10,
	},
	musicTypeContainer: {
		flexDirection: "row",
		alignItems: "center",
		columnGap: 5,
	},
	musicType: {
		fontFamily: fonts.body,
		fontSize: 11,
	},
	dateContainer: {
		flexDirection: "row",
		alignItems: "center",
		columnGap: 5,
	},
	date: {
		fontFamily: fonts.body,
		fontSize: 11,
		textTransform: "capitalize",
	},
});
