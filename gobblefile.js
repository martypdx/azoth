/* globals require, module */
const gobble = require( 'gobble' );
const path = require( 'path' );
const compile = require( 'diamond-compiler' ).default;

function jsd(source){
	return compile(source);
}

jsd.defaults = {
	accept: [ '.js' ],
	ext: '.js'
};

const tests = gobble( 'test/tests' )
	.exclude( '*.onhold.js' )
	.transform( jsd )
	.transform( 'flatten' );

const index = tests.include( ['**/*.js'] )
	.transform( function importFiles( /*code*/ ) {
		const filename = this.filename;
		const basename = path.basename( filename, path.extname( filename ) );	
		return `import './${basename}';`;
	})
	.transform( 'concat', { 
		dest: 'index.js', 
		separator: '\n' 
	});
	
const qunit = gobble( 'test' ).include( 'qunit.js' );

const test = gobble( [ index, tests, qunit, 'src' ] )
	.transform( 'rollup', {
		// plugins: [ buble() ],
		entry: 'index.js',
		dest: 'test.js',
		format: 'iife',
		globals: {
			'rxjs/Observable': 'Rx.Observable',
			'rxjs/BehaviorSubject': 'Rx.BehaviorSubject',
			'rxjs/operator/combineLatest': 'Rx.Observable.combineLatest'
		}
	});

// const build = gobble( [ index, 'src' ] )
// 	.transform( 'rollup', {
// 		// plugins: [ buble() ],
// 		entry: 'main.js',
// 		dest: 'diamond.js',
// 		format: 'iife'
// 	});

// const min = build.transform( 'uglifyjs', { ext: '.min.js' });

const html = gobble( 'test' ).include( 'index.html' );
const research = gobble( 'research' ).moveTo( 'research' );

module.exports = gobble( [ test, /*build, min,*/ html, research ] );
