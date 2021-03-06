import { module, test, fixture } from '../qunit';
import { _, $, Spliceable } from '../../src/azoth';
import { BehaviorSubject } from 'rxjs-es/BehaviorSubject';

module('Spliceable block component', () => {

    test('single element', t => {
        const template = (colors=$) => _`
            <ul>
                <#:${Spliceable(colors)} map=${color => _`<li>${color}</li>`}/>
            </ul>
        `;

        const colors = new BehaviorSubject({ index: 0, items: ['red', 'yellow', 'blue'] });

        const fragment = template(colors);
        fixture.appendChild(fragment);

        t.equal(fixture.cleanHTML(), 
            `<ul>
                <!-- component start --><li>red</li><li>yellow</li><li>blue</li><!-- component end -->
            </ul>`
        );

        colors.next({ index: 1, deleteCount: 1 });

        t.equal(fixture.cleanHTML(), 
            `<ul>
                <!-- component start --><li>red</li><li>blue</li><!-- component end -->
            </ul>`
        );

        colors.next({ index: 0, deleteCount: 1, items: ['orange', 'green'] });

        t.equal(fixture.cleanHTML(), 
            `<ul>
                <!-- component start --><li>orange</li><li>green</li><li>blue</li><!-- component end -->
            </ul>`
        );

        fragment.unsubscribe();

        t.equal(fixture.cleanHTML(), 
            `<ul>
                <!-- component start --><!-- component end -->
            </ul>`
        );
    });

    test('text nodes', t => {
        const template = (colors=$) => _`<#:${Spliceable(colors)} map=${color => _`${color}`}/>`;

        const items = new BehaviorSubject({ index: 0, items: ['red', 'yellow', 'blue'] });

        const fragment = template(items);
        fixture.appendChild(fragment);
        t.equal(fixture.cleanHTML(), '<!-- component start -->redyellowblue<!-- component end -->');

        items.next({ index: 1, deleteCount: 1 });
        t.equal(fixture.cleanHTML(), '<!-- component start -->redblue<!-- component end -->');

        items.next({ index: 0, deleteCount: 1, items: ['orange', 'green'] });
        t.equal(fixture.cleanHTML(), '<!-- component start -->orangegreenblue<!-- component end -->');

        fragment.unsubscribe();
        t.equal(fixture.cleanHTML(), `<!-- component start --><!-- component end -->`);
    });

    test('multiple top-level nodes', t => {
        const template = (colors=$) => _`<#:${Spliceable(colors)} 
            map=${color => _`${color}-<em>${color}</em>`}/>`;

        const items = new BehaviorSubject({ index: 0, items: ['red', 'yellow', 'blue'] });

        const fragment = template(items);
        fixture.appendChild(fragment);
        t.equal(fixture.cleanHTML(), '<!-- component start -->red-<em>red</em>yellow-<em>yellow</em>blue-<em>blue</em><!-- component end -->');
        
        items.next({ index: 1, deleteCount: 1 });
        t.equal(fixture.cleanHTML(), '<!-- component start -->red-<em>red</em>blue-<em>blue</em><!-- component end -->');
        
        items.next({ index: 0, deleteCount: 1, items: ['orange', 'green'] });
        t.equal(fixture.cleanHTML(), '<!-- component start -->orange-<em>orange</em>green-<em>green</em>blue-<em>blue</em><!-- component end -->');

        fragment.unsubscribe();
        t.equal(fixture.cleanHTML(), `<!-- component start --><!-- component end -->`);
    });

    test('returned template variable', t => {
        const slime = _`slime`;
        const hot = _`hot`;
        const template = (colors=$) => _`<#:${Spliceable(colors)} 
            map=${color => /yellow|green/.test(color) ? slime : hot}}
        />`;

        const items = new BehaviorSubject({ index: 0, items: ['red', 'yellow', 'blue'] });

        const fragment = template(items);
        fixture.appendChild(fragment);
        t.equal(fixture.cleanHTML(), '<!-- component start -->hotslimehot<!-- component end -->');
        
        items.next({ index: 0, deleteCount: 1, items: ['orange', 'green'] });
        t.equal(fixture.cleanHTML(), '<!-- component start -->hotslimeslimehot<!-- component end -->');
        
        fragment.unsubscribe();
        t.equal(fixture.cleanHTML(), `<!-- component start --><!-- component end -->`);
    });

    test('live indexes', t => {
        const template = (colors=$) => _`<#:${Spliceable(colors)} map=${(color, index=$) => _`*${index + 1}-${color};`}/>`;

        const items = new BehaviorSubject({ index: 0, items: ['red', 'yellow', 'blue'] });

        const fragment = template(items);
        fixture.appendChild(fragment);
        t.equal(fixture.cleanHTML(), '<!-- component start -->1-red;2-yellow;3-blue;<!-- component end -->');

        items.next({ index: 1, deleteCount: 1 });
        t.equal(fixture.cleanHTML(), '<!-- component start -->1-red;2-blue;<!-- component end -->');

        items.next({ index: 0, deleteCount: 1, items: ['orange', 'green'] });
        t.equal(fixture.cleanHTML(), '<!-- component start -->1-orange;2-green;3-blue;<!-- component end -->');

        fragment.unsubscribe();
        t.equal(fixture.cleanHTML(), `<!-- component start --><!-- component end -->`);
    });


});