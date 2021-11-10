new require("styles/dark")

const rect = class Rect extends require("base/view"){
	prototype() {
		let colors = module.worker.style.colors
		this.heavy = false
		this.props = {
			id     :"",
			onSlide:undefined,
		}
		
		this.innerPadding = [0, 0, 0, 0]
		
		this.states = {
			// animation!
			default :{
				to       :{
					Rect:{
						bgColor     :"#fafafa",
						handlesColor:"white",
						state       :"default",
					},
				},
				interrupt:false,
			},
			hovered :{
				to:{
					Rect:{
						bgColor     :"#fafafa",
						handlesColor:"blue",
						state       :"hovered",
					},
				},
			},
			selected:{
				to:{
					Rect:{
						bgColor     :"#fafafa",
						handlesColor:"blue",
						state       :"selected",
					},
				},
			},
		}
		
		this.isHovered = () =>{
			return this.state === "hovered"
		}
		
		//this.wrapped = false
		this.tools = {
			Rect:require("shaders/quad").extend({
				bgColor     :"white",
				handlesColor:"blue",
				state       :"unselected",
				vertexStyle :function () {$
					this.w = 250.
					this.h = 250.
				},
				pixel       :function () {$
					this.viewport()
					this.box(0, 0, this.w, this.h, 1.)
					this.fill(this.bgColor)
					
					this.box(0, 0, this.w, this.h, 1.)
					this.stroke(this.handlesColor, 2.)
					
					return this.result
				},
			}),
		}
	}
	
	mapValue(pos) {
		var v = clamp(pos, 0, 1) * (this.range[1] - this.range[0]) + this.range[0]
		if(this.step) {
			v = floor(v / this.step + 0.5) * this.step
		}
		return v
	}
	
	onFingerDown(e) {
		var le = this.toLocal(e)
		// check where we clicked
		var pos = (this.value - this.range[0]) / (this.range[1] - this.range[0])
		if(this.vertical) {
			var yp = this.dragSize * pos // + this.innerPadding[0]
			if(le.y > yp && le.y < yp + this.knobSize) {
				this.dragOffset = le.y - yp // + this.innerPadding[0]
			}
			else {
				// compute pos
				this.dragOffset = 0.5 * this.knobSize // + this.innerPadding[0]
				this.value = this.mapValue((le.y - this.dragOffset) / this.dragSize)
				//if(this.onValueStamp) this.onValueStamp({value:this.value})
				if(this.onSlide) this.onSlide(this) //this.value)
			}
		}
		else {
			var xp = this.dragSize * pos // + this.innerPadding[3]
			
			if(e.x > xp && e.x < xp + this.knobSize) {
				this.dragOffset = e.x - xp // + this.innerPadding[3]
			}
			else {
				// compute pos
				this.dragOffset = 0.5 * this.knobSize // + this.innerPadding[3]
				this.value = this.mapValue((le.x - this.dragOffset) / this.dragSize)
				//if(this.onValueStamp) this.onValueStamp({value:this.value})
				if(this.onSlide) this.onSlide(this)
			}
		}
		
		this.setState("selected")
	}
	
	onFingerMove(e) {
		var le = this.toLocal(e)
		//console.log(this.view.name)
		if(this.vertical) {
			this.value = this.mapValue((le.y - this.dragOffset) / this.dragSize)
		}
		else {
			this.value = this.mapValue((le.x - this.dragOffset) / this.dragSize)
		}
		this.setState("selected", false, {value:this.value})
		if(this.onSlide) this.onSlide(this)
	}
	
	onFingerOver() {
		this.setState("hovered")
	}
	
	onFingerOut() {
		this.setState("default")
	}
	
	onFingerUp(e) {
		this.setState(e.samePick?"hovered":"default")
	}
	
	onDraw() {
		//var pos = (this.value - this.range[0])/(this.range[1]-this.range[0])
		if(this.vertical) {
			this.dragSize = this.turtle.height - this.knobSize
		}
		else {
			this.dragSize = this.turtle.width - this.knobSize
		}
		
		this.drawRect({
			w       :"100%",
			h       :"100%",
			knobSize:this.knobSize,
			vertical:this.vertical,
			range   :this.range,
			step    :this.step,
			value   :this.value,
		})
	}
}

module.exports = class extends require("base/drawapp"){
	prototype() {
		this.tools = {}
		
		this.tools = {
			Rect:rect.extend({
				Rect:{
					method   :function (v) {
						return "white"
						//return mix('#0090fbff', '#ff0b00ff', abs(sin(this.mesh.y * 18 + v + this.time)))
					},
					// pixel: function () {
					//   this.viewport();
					//   this.box(0, 0, this.w, this.h, 1);
					//   this.fill(this.bgColor);
					//   if (this.vertical < 0.5) {
					//     this.box(this.slide, 0, this.knobSize, this.h, 1);
					//     this.fill(this.knobColor);
					//   } else {
					//     this.box(0, this.slide, this.w, this.knobSize, 1);
					//     this.fill(this.method(this.slide / this.h));
					//   }
					//   return this.result;
					// },
					knobColor:"green",
				},
			}),
		}
	}
	onSlide(sld) {
		_=[sld.id, sld.value]
	}
	onDraw() {
		//_='HELLO WORLD ' + this.time
		var t = 0.5
		for(let i = 0;i < 1;i++){
			//t = clamp(t + (1 - random() * 2) * 0.1, 0, 1)
			
			this.drawRect({
				margin  :0,
				knobSize:50,
				vertical:true,
				value   :t,
				id      :i,
				onSlide :this.onSlide,
			})
		}
		//this.redraw(true)
	}
}
