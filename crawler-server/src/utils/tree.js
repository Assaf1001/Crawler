const Queue = require("./queue");

class Node {
    constructor(url, title, depth, links) {
        this.url = url;
        this.title = title;
        this.depth = depth;
        this.links = links;
        this.address = "0";
        this.children = [];
    }

    addChild(node) {
        node.address = this.address + "-" + this.children.length;
        this.children.push(node);
    }
}

class Tree {
    constructor() {
        this.root = null;
    }

    setRoot(root) {
        this.root = root;
    }

    createNode(pageObj) {
        const node = new Node(
            pageObj.url,
            pageObj.title,
            pageObj.depth,
            pageObj.links
        );
        return node;
    }

    getNodeByAddress(address) {
        if (address === "0") return this.root;

        const addressArr = address.split("-");
        let node = this.root;
        for (let i = 1; i < addressArr.length; i++) {
            node = node.children[addressArr[i]];
        }
        return node;
    }

    bfsTraverse() {
        if (this.root == null) return [];

        const q = new Queue();
        const bfsArr = [];
        let currentNode = this.root;
        q.enqueue(currentNode);

        while (q.size > 0) {
            currentNode = q.dequeue();
            bfsArr.push(currentNode);
            for (let child of currentNode.children) {
                q.enqueue(child);
            }
        }

        return bfsArr;
    }
}

// const tree = new Tree();
// tree.root = new Node("a", "a", 0);
// const b = new Node("b", "b", 1);
// const c = new Node("c", "c", 1);

// tree.root.addChild(b);
// tree.root.addChild(c);

// const bb = new Node("bb", "bb", 2);
// b.addChild(bb);
// const cc = new Node("cc", "cc", 2);
// const dd = new Node("dd", "dd", 2);
// c.addChild(cc);
// c.addChild(dd);

// console.log(tree.root.children[1].children);

// tree.root.addressGenerator();

// tree.root.children = [b, c];
// b.parentAddress = "0";
// b.addressGenerator();
// c.parentAddress = "0";
// c.addressGenerator("0");

// // console.log(tree.getNodeByAddress("0-0"));

// const bbb = new Node("bbb", "bbb", 3);
// const bbbb = new Node("bbbb", "bbbb", 4);
// b.children = [bb];
// bb.children = [bbb];
// // bb.parentAddress = "0-0";
// bb.addressGenerator();
// // console.log(bb);
// bbb.children = [bbbb];
// c.children = [cc];
// console.log(c);

// console.log(tree.root);

// console.log(tree.bfsTraverse());

module.exports = { Tree };
