import type Artist from "../models/artist";

class ArtistApiService {
  // récupérer un artiste par son slug
  public getArtistBySlug = async (
    slug: string
  ): Promise<Artist | undefined> => {
    const request = new Request(
      `http://192.168.1.177:3000/artists?slug=${slug}&_embed=music_type`
    );
    const response = await fetch(request);
    const data = await response.json();

    return (data as Artist[]).shift();
  };
  // récupérer tous les artistes

  public getAllArtists = async (): Promise<Artist[]> => {
    const response = await fetch("http://192.168.1.177:3000/artists");
    return await response.json();
  };
}

export default  new ArtistApiService;
