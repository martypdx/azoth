import bound from './bound';

/*
	return ( { task, done } ) {
		let editing = false;
		<div>
			<input type="checkbox" value=done>
			<#when ( editing ) {
				<input value=task 
					   on-render="({node}) => node.focus()"
					   on-blur="() => editing = false">
			}#else {
				<label class-done=done 
					   on-click="() => editing = true">
					<# task #>
				</label>
			}#>
		</div>;
	}
*/

export default function make({ bindings, data, state }) {
	
	const template = `<div>
		<input type="checkbox" data-bind>
		<section-node></section-node>
	<div>`;
	
	const task = data.create( 'task' );
	const done = data.create( 'done' );
	const editing = state.create( 'editing', false );
	
	bindings[0] = bound.property( 'value', done );
	
	bindings[1] = bound.section( 'when', editing, {
		template: `<input data-bind>`,
		bindings: bindings => {
			const b0 = bound.event( 'render', ({ node }) => node.focus() );
			const b1 = bound.event( 'blur', ({ __state }) => __state.set( 'editing', false ) );
			bindings[0] = ( context, node ) => {
				b0( context, node );
				b1( context, node );
			};
		}
	}, {
		template: `<label class="" data-bind></label>`,
		bindings: bindings => {
			const b0 = bound.class( 'done', done );
			const b1 = bound.event( 'click', ({ __state }) => __state.set( 'editing', true ) );
			const b2 = bound.text( task );
			bindings[0] = ( context, node ) => {
				b0( context, node );
				b1( context, node );
				b2( context, node );
			};
		}
	});
	
	return template;
}