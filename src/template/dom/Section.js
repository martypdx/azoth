import DOMTemplate from './DOMTemplate';
import bind from '../../bind';
import blocks from '../../blocks';
import $ from './static';

export default class Section {
	
	constructor ( binding, template ) {
		this.binding = binding;
		
		this.template = template;
		
		const Block = blocks[ binding.type ];
		
		if ( !Block ) throw new Error( `Unrecognized section type ${binding.type}` );

		this.block = new Block();
	}
	
	node () {
		return $.comment( this.binding.type );
	}
	
	bind ( context, anchor ) {
		const template = this.template;
		const renderer = this.template.renderer;
		
		function add( addContext ) {
			renderer.enqueue( () => {
				const node = template.render( addContext );
				anchor.parentNode.insertBefore( node, anchor );
			});
		}
		
		this.block.bind( context, this.binding, add );
		
	}
}