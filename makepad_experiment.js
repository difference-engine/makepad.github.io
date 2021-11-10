// require("./platform/node");
var AstGlslGen = require("parsers/astglslgen");

class MakepadExperiment {
  $methodDeps = {
    vertexMain: this.vertexMain,
  };

  something() {
    let j = vec3(1.0, 1.0, 0.0);
    return j;
  }

  vertexMain() {
    let z = 3.0;
    let pos1 = vec4(1.0, 1.0, 1.0, 1.0);
    let pos2 = vec4(1.0, 1.0, 1.0, 1.0);
    const val = z == 3.0 ? this.something() : this.something();
    const s = radians(5.0);

    if (z < 5.0) {
      gl_Position = pos1;
    } else {
      gl_Position = pos2;
    }
  }

  compileVertexShader() {
    var vtx = AstGlslGen.generateGLSL(
      this,
      this.vertexMain,
      null,
      null,
      null,
      null
    );
    console.log("Vertex shader", vtx);
    console.log("Vertex shader code");
    console.log(vtx.main);
  }
}

const experiment = new MakepadExperiment();
experiment.compileVertexShader();
