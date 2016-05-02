import Context from './Context';
import dom from './template/dom';
import DOMTemplate from './template/dom/DOMTemplate';
import bind from './bind'; 

export default class Diamond {
	
	constructor( { template, data, el } ) {
		
		const context = new Context( data );
		const node = template.render( context );
		
		template.renderer.render();
		//bind( queue, context );
		
		el.appendChild( node );
	}
		
}

Diamond.dom = dom;
Diamond.Renderer = Renderer;

function Renderer() {
	this.queue = [];
}

Renderer.prototype = {
	constructor: Renderer,
	compile( template ) {
		return new DOMTemplate( this, template );
	},
	enqueue( section ) {
		this.queue.push( section );
	},
	render(){
		const queue = this.queue;
		var action;
		
		
		var count = 0;
		
		while( queue.length ) {
			queue.shift()();
			
			count++;
			
			if ( count > 10 ) {
				self.requestAnimationFrame( () => {
					this.render();
				});
				break;
			}
		}
	}
}