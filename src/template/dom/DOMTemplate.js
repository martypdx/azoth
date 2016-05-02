import getBindings from '../getBindings';
// import queueBindings from '../queueBindings';
import getBindingTree from '../../getBindingTree';

export default class DOMTemplate {
	
	constructor ( renderer, { fragment, bindings, getNodes } ) {
		this.renderer = renderer;
		this.fragment = fragment;
		this.bindings = bindings;
		this.getNodes = getNodes;
	}
	
	node () {
		return document.createDocumentFragment();
	}
	
	render( context ) {
		const clone = this.fragment.cloneNode( true );
		const nodes = this.getNodes( clone );
		const bindings = this.bindings;
		const renderer = this.renderer;
				
		nodes.forEach( ( node, i ) => {
			renderer.enqueue( () => {
				bindings[i].bind( context, node );
			});
		})
		
		// for ( var i = 0, l = nodes.length; i < l; i++ ) {
		// 	binding = bindings[i], node = nodes[i];
		// 	renderer.enqueue( () => {
		// 		binding.bind( context, node );
		// 	});
		// }
				
		return clone;
	}
}