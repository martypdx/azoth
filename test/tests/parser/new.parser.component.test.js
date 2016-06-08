import { test, module } from './qunit';
import { $, getContext } from './new-parser/parser';
import { Component } from './new-parser/component';

module( 'new parser', () => {
	
	module( 'component' );

	test( 'basic component with closings', t => {
		
		class Main extends Component {
			
			static template( ComponentA, ComponentB, ComponentC ) {
				return () => $`
					<${ComponentA()}/>
					<${ComponentB()}></component>
					<${ComponentC()}></${ComponentC}>
				`;
			}
		}
		class ComponentA extends Component {}
		class ComponentB extends Component {}
		class ComponentC extends Component {}
		
		const render = Main.compile( ComponentA, ComponentB, ComponentC );
		const context = getContext();
		const result = render( context );
		
		t.deepEqual( result, {
			html: '<component data-bind></component>' +
				  '<component data-bind></component>' +
				  '<component data-bind></component>',
			bindings: [
				{ type: 'component', constructor: ComponentA },
				{ type: 'component', constructor: ComponentB },
				{ type: 'component', constructor: ComponentC }
			]
		});
	});

	test( 'component attributes', t => {
		
		class ComponentA extends Component {
			
			static template( ComponentB ) {
				return foo => $`
					<${ComponentB()} foo=${foo} on-add=${() => console.log( foo )}/>
				`;
			}
		}
		class ComponentB extends Component {}
		
		const render = ComponentA.compile( ComponentB );
		const context = getContext();
		const result = render( context );
		
		t.deepEqual( result, {
			html: '<component foo data-bind></component>',
			bindings: [{
				type: 'wrap',
				bindings: [{ 
					type: 'component',
					constructor: ComponentB 
				}, {
					ref: '.',
					type: 'attr'
				}, {
					events: [ 'add' ],
					expr: '() => console.log( foo )',
					type: 'event'
				}]
			}]
		});
	});
	
	
});