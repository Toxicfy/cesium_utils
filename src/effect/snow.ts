import { uniforms } from './../../lib/Cesium.d'
import * as Cesium from 'cesium'
import Map from './index'
class Snow {
  private viewer: Cesium.Viewer
  private _options: {size?: number, speed?: number}
  private _snowStage: Cesium.PostProcessStage
  constructor (options = {}) {
    const defaultOptions = {
      size: 0.02,
      speed: 60
    }

    this._options = Object.assign({}, defaultOptions, options)
    this._snowStage = null
  }

  init (viewer: Cesium.Viewer) {
    if (!this.viewer) {
      throw new Error('viewer is not defined')
    }
    this.viewer = viewer

    // 后期处理其实是一个叠加修改的过程，通过不同步骤的加工，最后得到想要的结果
    this._snowStage = new Cesium.PostProcessStage({
      name: 'snow',
      fragmentShader: this._getFsShader(),
      uniforms: {
        size: () => this._options.size,
        speed: () => this._options.speed
      }
    })

    viewer.scene.postProcessStages.add(this._snowStage)
  }

  private _getFsShader (): string {
    // 1. uniform 外部程序传递给 shader 的变量，无法更改； uniform变量一般表示：变换矩阵，材质，光照参数和颜色等信息
    // 2. czm_frameNumber 当前的帧数，smoothstep(0, 1) 以用来生成0到1的平滑过渡值
    // 3. gl.FragCoord 当前像素相对于屏幕的坐标，屏幕左下角为原点
    return `uniform sampler2D colorTexture;
    varying vec2 v_textureCoordinates;
    uniform float size;
    uniform float speed;
    float snowFun(vec2 uv, float scale) {
        float time=czm_frameNumber/speed;
        float w=smoothstep(1.0,0.0, -uv.y*(scale/10.0));
        if(w<0.1) return 0.0;
        
        uv+=time/scale;
        uv.y+=time*2.0/scale;
        uv.x+=sin(uv.y+time*0.5)/scale;

        uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;
        p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);
        k=smoothstep(0.,k,sin(f.x+f.y)*snowSize);
        return k*w;
    }
    void main(void) {
        vec2 resolution=czm_viewport.zw;
        vec2 uv=(gl.FragCoord.xy*2.0-resolution.xy)/min(resolution.x,resolution.y);
        float finalColor=vec3(0);

        float c=0.;
        c+=snow(uv,30.)*.0;
        c+=snow(uv,20.)*.0;
        c+=snow(uv,15.)*.0;
        c+=snow(uv,10.);
        c+=snow(uv,8.);
        c+=snow(uv,6.);
        c+=snow(uv,5.);
        finalColor=(vec3(c));

        gl_FragColor=mix(texture2D(colorTexture,v_textureCoordinates),vec4(finalColor,1.0),0.5);
    }
    `
  }

  destroy () {
    if (!this.viewer || !this._snowStage) return
    this.viewer.scene.postProcessStages.remove(this._snowStage)
    this._snowStage.destroy()
    this._options = {}
  }

  get show () {
    if (!this._snowStage) return false
    return this._snowStage.enabled
  }

  set show (visible: boolean) {
    if (!this._snowStage) return
    this._snowStage.enabled = visible
  }
}

export default Snow
