//#!py
/**
 * @import eventer SvgNodes
 * @include setNodeChild
 */
const root = new SvgNodes.root({
	width: '100%',
	height: '100%',
})
setNodeChild(document.body, root.dom)

/**
 * @include rotatePoint
 */
function getReverseCtrlPoint(p, ctrlPoint)
	const offset = p.map((v, i)=> v - ctrlPoint[i])
	return rotatePoint(offset, 180).map((v, i)=> p[i] + v)
	 

/**
 * @include addEvent createSvgNode setSvgNodeStyle
 */
const pathNode = new SvgNodes.path({
	stroke: '#142bc1',
	strokeWidth: 2,
})
root.append(pathNode)

const pathShodow = new SvgNodes.path({
	stroke: '#788aff',
})
root.append(pathShodow)

const path = []
let lastCtrlPoint

eventer.on('tap', (e)=>{
	let ctrlPoint
	const lastPoint = getArrayValueByIndex(path, -1)
	if lastPoint
		if lastPoint.length > 2
			ctrlPoint = getReverseCtrlPoint(lastPoint.slice(0, 2), lastPoint.slice(-2))
			lastCtrlPoint = ctrlPoint
			
	/**
	 * @include xyKeys
	 */
	const p = xyKeys.map(key=> e[key])
	path.push(p)
			
	if ctrlPoint
		p.push(...ctrlPoint)
	
	pathNode.path = path
	pathNode.updateAttr('path', path)
	console.log(path)
})
eventer.on('over', (e)=>{
	/**
	 * @include xyKeys
	 */
	const p = xyKeys.map(key=> e[key])
	if path.length
		const lastPoint = getArrayValueByIndex(path, -1).slice(0, 2)
		if lastCtrlPoint
			p.push(...lastCtrlPoint)
		pathShodow.path = [lastPoint.slice(0, 2), p]
		console.log('over')
})

eventer.on('drag', {
	dragstart(e, op){
		/**
		 * @include xyKeys
		 */
		const p = xyKeys.map(key=> e[key])
		// pathShodow.path.push(p)
		// pathShodow.updateAttr('path', pathShodow.path)
		// pathShodow.path = path.slice(-1).concat([p])
		op.starts = getArrayValueByIndex(path, -1)
		op.ends = p
		
		ctrlPoint = null
		// if path.length
			// pathShodow.path = [path.slice(-1).concat([p])]
		return true
	},
	drag(e, op){
		/**
		 * @include xyKeys dragOffsetKeys rotatePoint getArrayValueByIndex
		 */
		if !pathShodow.path || pathShodow.path.length < 2
			return
			
		const {starts, ends} = op
			
		const ctrlPoint1 = xyKeys.map(key=> e[key])
		const ctrlPoint2 = rotatePoint(dragOffsetKeys.map(key=> e[key]), 180).map((v, i)=> ends[i] + v)
		// const point = getArrayValueByIndex(path, -1)
		
		// const point = ends.concat(p)
		
		ends.splice(2, 2, ...ctrlPoint2)
		
		
		pathShodow.ctrlPoint = ctrlPoint1
		pathShodow.path = [
			[
				starts,
				ends,
			],
			[
				ctrlPoint1,
				ctrlPoint2,
			],
			generateShapePath('circle', {
				r: 2
			}, true)
		]
		// console.log(point)
		
		// pathShodow.path = [path.slice(-1).concat([p])]
		// pathShodow.path = path.slice(-2)
		// if path.length
			// pathShodow.path = [path.slice(-1).concat([p])]
		return true
	},
	dragend(e, op){
		const {ends} = op
		path.push(ends)
		console.log('dragend', path)
		pathNode.updateAttr('path', path)
	},
})