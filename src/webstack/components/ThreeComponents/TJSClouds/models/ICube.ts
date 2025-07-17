interface Vector3 {
    x: number;
    y: number;
    z: number;
  }
  
  interface Animation {
    x: number;
    y: number;
    z: number;
    duration: number | 'infinite';
  }
  
  interface SceneProps {
    backgroundColor?: string;
    opacity?: number;
    size: {x: number, y: number};
  }
  
  interface ICubeCamera {
    position: Vector3;
    animation?: Animation;
  }
  
  interface ICubeLight {
    position: Vector3;
    animation?: Animation;
  }
  interface ICubeShadow {
    size: number;
    color: string;
    opacity: number;
  }
  
  interface ICube {
    size: Vector3;
    shadow?: boolean;
    animation?: Animation;
    color?: string;
    draggable?: boolean;
    scene?: SceneProps;
    camera: ICubeCamera;
    light?: ICubeLight;
  }
  export default ICube