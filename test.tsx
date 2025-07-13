import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ProgrammationApiService from '../../services/programmation_api_service';

const ProgrammationScreen = () => {
  const [stageTypes, setStageTypes] = useState([]);
  const [stages, setStages] = useState([]);
  const [programme, setProgramme] = useState([]);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const types = await ProgrammationApiService.getStageTypes();
      const stageList = await ProgrammationApiService.getStages();
      const prog = await ProgrammationApiService.getProgrammation();

      setStageTypes(types);
      setStages(stageList);
      setProgramme(prog);
    };

    fetchData();
  }, []);

  const renderArtistsForStage = (stageId: number) => {
    const items = programme.filter(p => p.stageId === stageId);
    return items.map((item, idx) => (
      <Text key={idx}>
        Artist ID: {item.artistId} | {item.startTime} → {item.endTime}
      </Text>
    ));
  };

  return (
    <ScrollView>
      {stageTypes.map((type: any) => (
        <View key={type.id}>
          <Text style={{ fontWeight: 'bold' }}>{type.name}</Text>
          {stages
            .filter(stage => stage.typeId === type.id)
            .map(stage => (
              <TouchableOpacity key={stage.id} onPress={() => setSelectedStageId(stage.id)}>
                <Text>{stage.name}</Text>
              </TouchableOpacity>
            ))}
        </View>
      ))}
      {selectedStageId && (
        <View>
          <Text>Artistes pour la scène {selectedStageId} :</Text>
          {renderArtistsForStage(selectedStageId)}
        </View>
      )}
    </ScrollView>
  );
};

export default ProgrammationScreen;
