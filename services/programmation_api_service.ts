import type Programme from "../models/programme";

class ProgrammationApiService {
  private baseUrl = "http://192.168.1.177:3000";
  

  // Toute la programmation
  public getProgrammation = async (): Promise<Programme[]> => {
    const response = await fetch(
      `${this.baseUrl}/programme?_embed=artist&_embed=stage&_embed=day`
    );
    return await response.json();
  };

  // Programmation d’un artiste
  public getProgrammationByArtistId = async (
    id: number
  ): Promise<Programme[]> => {
    const response = await fetch(
      `${this.baseUrl}/programme?artistId=${id}&_embed=artist&_embed=stage&_embed=day`
    );
    return await response.json();
  };

  // Types de scènes
  public getStageTypes = async () => {
    const response = await fetch(`${this.baseUrl}/stages_types_stages?_embed=stage_type&_embed=stage`);
    return await response.json();
  };

  // Toutes les scènes
  public getStages = async () => {
    const response = await fetch(`${this.baseUrl}/stages?_embed=stage_type`);
    return await response.json();
  };
}

export default  new ProgrammationApiService();
