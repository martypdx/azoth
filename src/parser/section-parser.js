import { getPosition, addBinding } from './domUtil';

const sectionBrackets = /(<#.+?.map\(.+?=>\s+?{\s*)|(#>)/g;
const mapping = /.map\(.*?{$/g

const sectionElName = 'section-node';
const tempName = 'temp-name';

export default function getSectionParser( BINDING_ATTR ) {
	return {
		replace( html, hash ) {
			var i = 0;
			return html.replace( sectionBrackets, match => {
				console.log( match )
				if ( match[0] === '#' ) return`</${sectionElName}>`;
				
				const name = `s${i++}`;
				const ref = match.trim().replace( mapping, match => {
					console.log( match );
					return '';	
				});
				
				console.log(ref);
					
				// const first = words.shift();
				// var replace = '';
				// if ( first[0] === '#' ) {
				// 	const type = first.slice(1);
				// 	const ref = words.join( ' ' );
				// 	hash[ name ] = { type, ref, binder: 'section' };
				// 	replace = `<${sectionElName} ${tempName}="${name}">`;
				// }
				// else {
				// }
				
				// return replace;
			});
		},
		make( host, template, makeBindings ) {
			const bindings = template.hash;
			
			[].slice.call( host.querySelectorAll( sectionElName ) )
				.forEach( node => {
					const name = node.getAttribute( tempName );
					const parent = node.parentNode;
					const isOrphan = parent === host;
					const binding = bindings[ name ];
					node.removeAttribute( tempName );

					// add the binding name to the parent element
					addBinding( parent, BINDING_ATTR, name );
					// orphans need to be tagged with binding attr
					if ( isOrphan ) node.setAttribute( BINDING_ATTR, '' );
					
					const pos = getPosition( node );
					// record non-zero index
					if ( pos ) binding.index = pos;

					// replace the section node with a clone of top-level <section-node>
					parent.replaceChild( node.cloneNode(), node );
					// remove the data-bind from the node as "host" for child bindings
					node.removeAttribute( BINDING_ATTR );
					// recurse!
					binding.template = makeBindings( node, template );
				});		
		}
	};
}