import Diamond from './diamond';

const test = QUnit.test;
const module = QUnit.module;
const fixture = document.getElementById( 'qunit-fixture' );
const skip = { test: () => {} };

module( `dom performance` );

const { $tatic, bound } = Diamond.dom;

const count = 1500;
const treshhold = 150;

test( `jsBlocks 12 column table with ${count} rows < ${treshhold}ms`, t => {
	
	const items = [];
	const columns = [ 'message', 'number', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth' ];
	
	for( var i = 0; i < count; i++ ) {        
		items[i] = {
			message: `message ${i}`,
			number: i,
			first: `first ${i}`,
			second: `second ${i}`,
			third: `third ${i}`,
			fourth: `fourth ${i}`,
			fifth: `fifth ${i}`,
			sixth: `sixth ${i}`,
			seventh: `seventh ${i}`,
			eighth: `eighth ${i}`,
			ninth: `ninth ${i}`,
			tenth: `tenth ${i}`,
		};
	}
	const start = performance.now();
	
	const renderer = new Diamond.Renderer();

	const bindings = columns.map( ref => bound.text({ ref }) );
	const tds = bindings.map( b => $tatic.el( 'td', null, [ b.node() ] ) );
	
	const s1 = bound( { type: 'for', ref: 'items' }, 
		renderer.compile({
			fragment: $tatic([
				$tatic.el( 'tr', null, tds ) 
			]),
			bindings,
			getNodes ( node ) {
				var tr = node.children[0];
				return [
					tr.children[0].childNodes[0],
					tr.children[1].childNodes[0],
					tr.children[2].childNodes[0],
					tr.children[3].childNodes[0],
					tr.children[4].childNodes[0],
					tr.children[5].childNodes[0],
					tr.children[6].childNodes[0],
					tr.children[7].childNodes[0],
					tr.children[8].childNodes[0],
					tr.children[9].childNodes[0],
					tr.children[10].childNodes[0],
					tr.children[11].childNodes[0],
				];
			}
		})
	);
	
	const template = renderer.compile({
		fragment: $tatic([
			$tatic.el( 'table', null, [ s1.node() ])
		]),
		bindings: [ s1 ],
		getNodes ( node ) {
			return [
				node.children[0].childNodes[0]
			];
		}
	});
	
	new Diamond( { 
		template, 
		data: { items }, 
		el: fixture 
	});
	
	const elapsed = performance.now() - start;
			
	t.ok( elapsed < treshhold, `render took ${elapsed}ms` );
	console.log( `dom render ${count} items: ${elapsed}ms` );
});


test( `mithril 150 simple items`, t => {
	
	const items = [{name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}, {name: "a"}, {name: "b"}, {name: "c"}];
	
	const start = performance.now();
	
	const renderer = new Diamond.Renderer();

	const t1 = bound.text({ ref: 'name' });
	const s1 = bound( { type: 'for', ref: 'items' }, 
		renderer.compile({
			fragment: $tatic([
				$tatic.el( 'span', null, [ t1.node() ]) 
			]),
			bindings: [ t1 ],
			getNodes ( node ) {
				return [
					node.children[0].childNodes[0]
				];
			}
		})
	);
	
	const template = renderer.compile({
		fragment: $tatic([
			$tatic([ s1.node() ])
		]),
		bindings: [ s1 ],
		getNodes ( node ) {
			return [
				node.childNodes[0]
			];
		}
	});
	
	new Diamond( { 
		template, 
		data: { items }, 
		el: fixture 
	});
			
	const elapsed = performance.now() - start;
	
	t.ok( true, `render took ${elapsed}ms` );
	
	console.log( `dom mithril test render: ${elapsed}ms` );
	
});

