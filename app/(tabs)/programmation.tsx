import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import ProgrammationApiService from '../../services/programmation_api_service';
import ArtistApiService from '../../services/artist_api_service';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

const ProgrammationScreen = () => {
  const [stageTypes, setStageTypes] = useState([]);
  const [stages, setStages] = useState([]);
  const [programme, setProgramme] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(1);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const types = await ProgrammationApiService.getStageTypes();
        const stageList = await ProgrammationApiService.getStages();
        const prog = await ProgrammationApiService.getProgrammation();
        const allArtists = await ArtistApiService.getAllArtists();

        setStageTypes(types);
        setStages(stageList);
        if (stageList.length > 0) {
          setSelectedStageId(stageList[0].id);
        }
        setProgramme(prog);
        setArtists(allArtists);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      }
    };

    fetchData();
  }, []);

  const filteredArtists = (stageId: number) => {
    return programme
      .filter(p => p.stageId === stageId)
      .map(p => ({
        ...p,
        artist: artists.find(a => a.id === p.artistId),
      }))
      .filter(p =>
        p.artist?.name.toLowerCase().includes(searchText.toLowerCase())
      );
  };

  const handleFavorite = async (artistId: number) => {
    const favoritesRaw = await AsyncStorage.getItem("favorites");
    let favorites: number[] = favoritesRaw ? JSON.parse(favoritesRaw) : [];

    if (favorites.includes(artistId)) {
      favorites = favorites.filter(id => id !== artistId);
    } else {
      favorites.push(artistId);
    }

    await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const isFavorite = async (artistId: number): Promise<boolean> => {
    const favoritesRaw = await AsyncStorage.getItem("favorites");
    const favorites: number[] = favoritesRaw ? JSON.parse(favoritesRaw) : [];
    return favorites.includes(artistId);
  };

 const renderArtistsForStage = (stageId: number) => {
  const items = filteredArtists(stageId);

  if (items.length === 0) {
    return <Text style={styles.emptyText}>Aucun artiste trouvé.</Text>;
  }

  return items.map((item, idx) => (
    <View key={idx} style={styles.artistCard}>
      <Image
        source={{
          uri: item.artist?.poster
            ? `http://192.168.1.177:3000/images/artists/${item.artist.poster}`
            : "https://via.placeholder.com/60?text=No+Img"
        }}
        style={styles.artistImage}
      />

      <View style={styles.artistInfo}>
        <Text style={styles.artistName}>{item.artist?.name}</Text>
        <Text style={styles.artistMeta}>
          {item.day?.date
            ? new Date(item.day.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
              })
            : 'Date inconnue'}
        </Text>
        <Text style={styles.artistMeta}>
          {item.stage?.name || 'Scène inconnue'}
        </Text>
      </View>

      <TouchableOpacity onPress={() => handleFavorite(item.artist.id)}>
        <Feather name="heart" size={22} color="#e91e63" />
      </TouchableOpacity>
    </View>
  ));
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {stageTypes.map((type: any) => (
        <View key={type.id} style={styles.stageTypeContainer}>
          <Text style={styles.stageTypeTitle}>{type.name}</Text>
          {stages
            .filter(stage => stage.typeId === type.id)
            .map(stage => (
              <TouchableOpacity
                key={stage.id}
                onPress={() => setSelectedStageId(stage.id)}
                style={[
                  styles.stageButton,
                  selectedStageId === stage.id && styles.stageButtonSelected
                ]}
              >
                <Text style={styles.stageName}>{stage.name}</Text>
              </TouchableOpacity>
            ))}
        </View>
      ))}

      {selectedStageId && (
        <View style={styles.artistSection}>
          <Text style={styles.sectionTitle}>Artistes pour la scène :</Text>
          <TextInput
            placeholder="Rechercher un artiste"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
          {renderArtistsForStage(selectedStageId)}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  stageTypeContainer: {
    marginBottom: 12
  },
  stageTypeTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6
  },
  stageButton: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4
  },
  stageButtonSelected: {
    backgroundColor: '#ccc'
  },
  stageName: {
    fontSize: 14
  },
  artistSection: {
    marginTop: 20
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8
  },
  searchInput: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8
  },
  artistCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  artistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12
  },
  artistInfo: {
    flex: 1
  },
  artistName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  artistMeta: {
    color: '#666',
    fontSize: 13
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#999',
    marginTop: 8
  }
});

export default ProgrammationScreen;
