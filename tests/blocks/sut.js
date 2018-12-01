
const throwNoDOM = val => {
    throw new Error(`Expected DOM Node but got ${typeof val}:${val}`);
};

const throwNoAnchor = () => {
    throw new Error('Block does not have an anchor set');
};

export default class Block {

    constructor({ anchor = null, map = null } = {}) {
        this.map = map;
        this._anchor = null;
        
        //clear
        this._topAnchor = null;
        
        if(anchor) this.anchor = anchor;

        // observable add, clear
        this._unsubscribes = null;
        this.unsubscribed = false;

        // by key
        this.dictionary = new Map();
        this.keyName = '';

        // remove
        this._blocks = [];
    }

    set anchor(anchor) {
        if(!anchor || !(anchor instanceof Node)) throwNoDOM(anchor);
        this._anchor = anchor;
        // clear
        this._topAnchor = anchor.previousSibling;
    }

    // clear
    _trackUnsubscribe({ unsubscribe }) {
        if(unsubscribe === undefined) return;
        if(this._unsubscribes === null) this._unsubscribes = unsubscribe;
        else if(Array.isArray(this._unsubscribes)) this._unsubscribes.push(unsubscribe);
        else this._unsubscribes = [this._unsubscribes, unsubscribe];
    }

    _getFirstBlockNodeByIndex(index = -1, blocks = this._blocks) {
        if(index === -1 || index === null || index === undefined) {
            return this._anchor;
        }

        const block = blocks[index];
        if(block === null || block === undefined) return this._anchor;

        if(Array.isArray(block)) return this._getFirstBlockNodeByIndex(0, block);

        const { nodes } = block;
        return Array.isArray(nodes) ? nodes[0] : nodes;
    }

    _getFirstBlockNodeByKey(key) {
        if(key === '' || key === null || key === undefined) {
            return this._anchor;
        }

        const block = this.dictionary.get(key);  
        if(block === null || block === undefined) return this._anchor;

        if(Array.isArray(block)) return this._getFirstBlockNodeByIndex(0, block);

        const { nodes } = block;
        return Array.isArray(nodes) ? nodes[0] : nodes;
    }

    add(item, index = -1) {
        const before = this._getFirstBlockNodeByIndex(index);
        const nodes = this._doAdd(item, before);
        // indexed remove
        this._blocks.push(nodes);
    }

    addByKey(item, key) {
        const before = this._getFirstBlockNodeByKey(key);
        const nodes = this._doAdd(item, before);
        // keyed remove
        const ownKey = this.keyName ? item[this.keyName] : item;
        this.dictionary.set(ownKey, nodes);
    }
        
    _doAdd(item, before) {
        const { map } = this;
        if(!map) return; //TODO: warn, throw, ???

        const dom = map(item);
        
        return this._insert(dom, before);
    }

    _insert(dom, before) {
        if(typeof dom === 'function') dom = dom(); // recursive needed? return this._insert(dom());
        
        if(Array.isArray(dom)) {
            // return map is for remove
            const map = new Array(dom.length);
            for(let i = 0; i < dom.length; i++) {
                map[i] = this._insert(dom[i], before);
            }
            return map; 
        }
        else if(!(dom instanceof Node)) throwNoDOM(dom);

        // add/remove, by index/key
        const { childNodes, unsubscribe } = dom;
        const nodes = childNodes.length > 1 ? [...childNodes] : childNodes[0];
        
        // clear
        this._trackUnsubscribe(dom);

        const { _anchor: anchor } = this;
        if(!anchor) throwNoAnchor();
        anchor.parentNode.insertBefore(dom, before);

        // remove
        return { nodes, unsubscribe };
    }

    removeAt(index) {
        // // FUTURE: when single element return is put in, optimize maybe like this:
        // // (would need to get right "index" if not only childNodes of parent)
        // const node = this._anchor.parentNode.childNodes[index];
        // node.unsubscribe();
        // node.remove();

        this.removeBlock(this._blocks[index]);
    }

    removeBlock(block) {
        if(Array.isArray(block)) {
            for(let i = 0; i < block.length; i++) this.removeBlock(block[i]);
            return;
        }

        const { nodes, unsubscribe } = block;

        if(Array.isArray(nodes)) {
            for(let c = 0; c < nodes.length; c++) nodes[c].remove();
        } 
        else nodes.remove();

        unsubscribe && unsubscribe();
    }

    unsubscribe() {
        const { _unsubscribes: unsubscribes } = this;
        if(unsubscribes === null) return;
        this._unsubscribes = null;

        if(Array.isArray(unsubscribes)) {
            for(let i = 0; i < unsubscribes.length; i++) unsubscribes[i]();
        }
        else {
            unsubscribes();
        }
    }

    clear() {
        const { _anchor: anchor, _topAnchor: top } = this;
        let sibling = anchor.previousSibling;
        while (sibling && sibling !== top) {
            const current = sibling;
            sibling = sibling.previousSibling;
            current.remove();
        }
    }
}