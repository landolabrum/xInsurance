export interface ILight {
  id_: string;
  name: string;
  is_on: boolean;
  bri: number;
  hue: number;
  sat: number;
  hex: string;
  sdk: {
    bridge_ip: string;
    username: string;
  };
}

export interface IGroup {
  group_id: string;
  group_name: string;
  lights: ILight[]; // Now lights are an array of ILight objects
  // Add other properties as needed based on the attributes of a group
}

export interface IHomePostLight {
  id: string;
  name: string;
  // Add other properties as needed based on the attributes of a light
}

export interface IHomePostLightRename extends IHomePostLight {
  new_name: string;
}

interface IHomePostGroup {
  group_name: string;
  lights: string[]; // Assuming light IDs are strings
}

interface IHomePutGroupModify {
  group_id: string;
  group_name?: string;
  lights?: string[];
}

export interface IHomeService {
  createGroup(newGroup: IGroup): Promise<IGroup>;
  modifyGroup(modifiedGroup: IHomePutGroupModify): Promise<IGroup>;
  deleteGroup(group_id: string): Promise<any>;
  listGroups(): Promise<IGroup[]>; // If you want to list all groups
  hue_list(hue_object?: string): Promise<ILight[]>;
  light({ id, name }: IHomePostLight): Promise<ILight>;
  hue_brightness(id: number, brightness: number, type?: string): Promise<ILight>;
  lightColor(id: any, hex: string, type?: string): Promise<any>;
  lightsOff(): Promise<any>;
  hue_toggle(id: any, hue_object?: string): Promise<any>;
  lightsOn(): Promise<any>;
  hue_rename(lightRename: IHomePostLightRename): Promise<any>;
  
  wbInfo(cameraId: string): Promise<string>;
  wbSnapshot(cameraId: string): Promise<string>;
  wbListCameras(): Promise<string>;
  ptzPosition(id: string, x: number, y: number, s?: number): Promise<any>;
  
  startVehicle(request: any): Promise<any>;
  getVehicles(access: any): Promise<any>;
  
  // Spotify control methods
  spotifyPlay(): Promise<any>;
  spotifyPause(): Promise<any>;
  spotifyNextTrack(): Promise<any>;
  spotifyPreviousTrack(): Promise<any>;
  setSpotifyVolume(volumePercent: number): Promise<any>;
  spotifyAuthorize(): Promise<any>;
  spotifyCallback(): Promise<any>;
  getSpotifyToken(): Promise<{ access_token: string }>;
}
export default IHomeService;
