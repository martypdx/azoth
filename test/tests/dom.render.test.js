import Diamond from './Diamond';

const test = QUnit.test;
const module = QUnit.module;
const fixture = document.getElementById( 'qunit-fixture' );
const skip = { test: () => {} };

module( 'dom render' );

const { $tatic, bound } = Diamond.dom;

test( 'elements and text', t => {
	
	const renderer = new Diamond.Renderer();
	
	const t1 = bound.text({ ref: 'foo' });
	const t2 = bound.text({ ref: 'bar' });
	
	const template = renderer.compile({
		fragment: $tatic.section([
			$tatic.el( 'div', null, [
				$tatic.el( 'span', null, [ t1.node() ] ),
				$tatic.el( 'span', null, [ $tatic.text( 'label: ' ), t2 ] )
			])
		]),
		bindings: [ t1, t2 ],
		getNodes ( node ) {
			const div = node.children[0];
			return [
				div.children[0].childNodes[0],
				div.children[1].childNodes[1]
			];
		}
	});
	
	new Diamond( { 
		template, 
		data: { foo: 'foo', bar: 'bar' }, 
		el: fixture 
	});
	
	t.equal( fixture.innerHTML, '<div><span>foo</span><span>label: bar</span></div>' );
});

test( 'static section', t => {
	
	const renderer = new Diamond.Renderer();

	const t1 = bound.text({ ref: 'foo' });
	
	const template = renderer.compile({
		fragment: $tatic.section([
			$tatic.el( 'div', null, [ t1.node() ] )
		]),
		bindings: [ t1 ],
		getNodes ( node ) {
			return [
				node.children[0].childNodes[0]
			];
		}
	});
	
	new Diamond( { 
		template, 
		data: { foo: 'foo' }, 
		el: fixture 
	});
	
	t.equal( fixture.innerHTML, '<div>foo</div>' );
});

test( '#for section', t => {
	
	const renderer = new Diamond.Renderer();

	const t1 = bound.text( { ref: '.' } );
	const s1 = bound.section( { type: 'for', ref: 'items' }, 
		renderer.compile({
			fragment: $tatic.section( [ $tatic.el( 'li', null, [ t1 ] ) ] ),
			bindings: [ t1 ],
			getNodes ( node ) {
				return [
					node.children[0].childNodes[0]
				];
			}
		})
	);
	
	const template = renderer.compile({
		fragment: $tatic.section([ s1.node() ]),
		bindings: [ s1 ],
		getNodes ( node ) {
			return [
				node.childNodes[0]
			];
		}
	});
	
	new Diamond( { 
		template, 
		data: { items: [ 1, 2, 3 ] }, 
		el: fixture 
	});	
	
	t.equal( fixture.innerHTML, '<li>1</li><li>2</li><li>3</li><!--for-->' );

});

(function () {
	
	const renderer = new Diamond.Renderer();

	const t1 = bound.text({ ref: 'foo' });
	const s1 = bound.section( { type: 'if', ref: 'condition' }, 
		renderer.compile({
			fragment: $tatic.section( [ $tatic.el( 'li', null, [ t1.node() ] ) ] ),
			bindings: [ t1 ],
			getNodes ( node ) {
				return [
					node.children[0].childNodes[0]
				];
			}
		})
	);
	
	const template = renderer.compile({
		fragment: $tatic.section([ s1.node() ]),
		bindings: [ s1 ],
		getNodes ( node ) {
			return [
				node.childNodes[0]
			];
		}
	});
		
	test( '#if section true', t => {
		new Diamond( { 
			template, 
			data: { condition: true, foo: 'foo' }, 
			el: fixture 
		});	
		t.equal( fixture.innerHTML, '<li>foo</li><!--if-->' );
	});

	
	test( '#if section false', t => {
		new Diamond( { 
			template, 
			data: { condition: false, foo: 'foo' }, 
			el: fixture 
		});	
		t.equal( fixture.innerHTML, '<!--if-->' );
	});
	
})();

(function () {
	
	const renderer = new Diamond.Renderer();

	const t1 = bound.text({ ref: 'a' });
	const t2 = bound.text({ ref: 'b' });
	
	const s1 = bound.section( { type: 'with', ref: 'obj' }, 
		renderer.compile({
			fragment: $tatic.section( [ $tatic.el( 'p', null, [ t1, t2 ] ) ] ),
			bindings: [ t1, t2 ],
			getNodes ( node ) {
				var p = node.children[0];
				return [
					p.childNodes[0],
					p.childNodes[1]
				];
			}
		})
	);
	
	const template = renderer.compile({
		fragment: $tatic.section([ s1.node() ]),
		bindings: [ s1 ],
		getNodes ( node ) {
			return [
				node.childNodes[0]
			];
		}
	});
		
	test( '#with section', t => {
		new Diamond( { 
			template, 
			data: { obj: { a: 'A', b: 'B' } }, 
			el: fixture 
		});	
		t.equal( fixture.innerHTML, '<p>AB</p><!--with-->' );
	});

	test( '#with section, no object', t => {
		new Diamond( { 
			template, 
			data: {}, 
			el: fixture 
		});	
		t.equal( fixture.innerHTML, '<!--with-->' );
	});

})();