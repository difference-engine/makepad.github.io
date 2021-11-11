new require("styles/dark")

const rect = class Rect extends require("base/view"){
	prototype() {
		let colors = module.worker.style.colors
		this.heavy = false
		this.props = {
			id              :0.0,
			onPositionChange:undefined,
			onSelect        :undefined,
			selected        :0
		}
		
		this.innerPadding = [0, 0, 0, 0]
		
		this.states = {
			// animation!
			default:{
				to       :{
					Rect:{
						bgColor:"#fafafa",
						hovered:0,
					},
				},
				interrupt:false,
			},
			hovered:{
				to:{
					Rect:{
						bgColor:"#fafafa",
						hovered:1,
					},
				},
			},
		}
		
		
		
		this.dragOffset = {x:0, y:0}
		this.tools = {
			Rect:require("shaders/quad").extend({
				bgColor       :"white",
				selectionColor:"#18a0fb",
				state         :"unselected",
				id            :0.0,
				selected      :0,
				hovered       :0,
				vertexStyle   :function () {$},
				handleSize    :9.0,
				handleAt      :function(x, y) {
					this.rect(x, y, this.handleSize, this.handleSize)
					this.fillKeep(this.bgColor)
					this.stroke(this.selectionColor, 1., 1.)
				},
				pixel         :function () {$
					this.viewport()
					
					this.rect(this.handleSize / 2., this.handleSize / 2., this.w - this.handleSize, this.h - this.handleSize)
					//this.fill(vec4(sin(radians(this.id)), cos(radians(this.id)), tan(radians(this.id)), 0.8))
					this.fill(vec4(1.0, 1.0, 1.0, 1.))
					
					if(this.selected > 0.5) {
						this.rect(this.handleSize / 2., this.handleSize / 2., this.w - this.handleSize, this.h - this.handleSize)
						this.stroke(this.selectionColor, this.hovered > 0.5?1.8:1.5)
						
						this.handleAt(0, 0)
						this.handleAt(this.w - this.handleSize, 0)
						this.handleAt(0, this.h - this.handleSize)
						this.handleAt(this.w - this.handleSize, this.h - this.handleSize)
					}
					else if(this.hovered > 0.5) {
						this.rect(this.handleSize / 2., this.handleSize / 2., this.w - this.handleSize, this.h - this.handleSize)
						this.stroke(this.selectionColor, 1.8)
					}
					
					return this.result
				},
			}),
		}
	}
	
	onFingerDown(e) {
		//var le = this.toLocal(e)
		let localX = e.x - this.x
		let localY = e.y - this.y
		this.dragOffset.x = -localX
		this.dragOffset.y = -localY
		//console.log('FINGER DOWN', localX, localY)
		if(this.onSelect) this.onSelect(this.id)
		this.setState("hovered")
	}
	
	onFingerMove(e) {
		this.x = e.x + this.dragOffset.x
		this.y = e.y + this.dragOffset.y
		this.setState("hovered", false, {x:this.x, y:this.y})
		//console.log('>>> MOVE', this.x, this.y, this.dragOffset)
	}
	
	onFingerOver() {
		this.setState("hovered")
	}
	
	onFingerOut() {
		this.setState("default")
	}
	
	onFingerUp(e) {
		if(this.onPositionChange) this.onPositionChange(this.id, {x:this.x, y:this.y})
		this.setState(e.samePick?"hovered":"default")
	}
	
	onDraw() {
		//console.log('>>>', 'onDraw')
		
		this.drawRect({
			id      :this.id,
			x       :this.x,
			y       :this.y,
			w       :this.w,
			h       :this.h,
			selected:this.selected
		})
		
	}
}

module.exports = class extends require("base/drawapp"){
	prototype() {
		this.rects = []
		this.selectedRectId = undefined
		this.tools = {}
		this.tools = {
			Rect:rect.extend({
				Rect:{},
			}),
		}
	}
	
	onPositionChange(id, pos) {
		let rect = this.rects[id]
		if(rect && (rect.x !== pos.x || rect.y !== pos.y)) {
			rect.x = pos.x
			rect.y = pos.y
			this.redraw(true)
		}
	}
	onSelect(id) {
		console.log('OnSELECT', id)
		if(this.selectedRectId !== id) {
			this.selectedRectId = id
			this.redraw(true)
		}
	}
	randomIntFromInterval(min, max) { // min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min)
	}
	initializeRects() {
		for(let i = 0;i < 50;i++){
			this.rects.push({
				id:i,
				x :this.randomIntFromInterval(0, 500),
				y :this.randomIntFromInterval(0, 500),
				h :this.randomIntFromInterval(100, 200),
				w :this.randomIntFromInterval(100, 200),
			})
		}
	}
	onDraw() {
		console.log('>>> rects>onDraw')
		var t = 0.5
		if(this.rects.length === 0) {
			this.initializeRects()
		}
		this.rects.forEach((rect) =>{
			this.drawRect({
				x               :rect.x,
				y               :rect.y,
				h               :rect.h,
				w               :rect.w,
				id              :rect.id,
				z               :this.selectedRectId === rect.id?1:0,
				onPositionChange:this.onPositionChange.bind(this),
				onSelect        :this.onSelect.bind(this),
				selected        :this.selectedRectId === rect.id?1:0,
			})
		})
	}
}
