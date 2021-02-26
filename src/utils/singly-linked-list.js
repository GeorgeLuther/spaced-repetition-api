class _Node {
    constructor(value, next){
        this.value = value
        this.next = next
    }
}
class SLL {
    constructor() {
      this.head = null;
    }
    insertFirst(value) {
      this.head = new _Node(value, this.head);
    }
    insertLast(value) {
      if (this.head === null) {
        this.insertFirst(value);
      } else {
        let currNode = this.head;
        while (currNode.next !== null) {
            currNode = currNode.next;
        }
        currNode.next = new _Node(value, null);
      }
    }
    find(value) {
        let currNode = this.head
        if (!this.head) {
            return null
        }
        while (currNode.value !== value) {
            if (currNode.next === null) {
                return null
            }
            currNode = currNode.next
        }
        return currNode
    }
    remove(item){
        if (!this.head){
            return null
        }
        if (this.head.value === item){
            this.head = this.head.next
            return
        }
        let currNode = this.head
        let prevNode = this.head

        while ((currNode !== null) && (currNode.value !== item)){
            prevNode = currNode
            currNode = currNode.next
        }
        if (currNode === null) {
            console.log('Item not found')
            return
        }
        prevNode.next = currNode.next
    }
    insertBefore(value, target) {
      if (!this.head) this.insertFirst(value);
      let currNode = this.head;
      let previousNode = this.head;
      while (currNode !== null && currNode.value !== target) {
        previousNode = currNode;
        currNode = currNode.next;
      }
      if (currNode === null) {
        console.log('Target node not found');
        return;
      }
      previousNode.next = new _Node(value, previousNode.next);
    }
    insertAfter(val, target) {
      if (!this.head) {
        this.insertFirst(val);
      }
      let currNode = this.head;
      while (currNode.next !== null && currNode.value !== target) {
        currNode = currNode.next;
      }
      if (currNode.next === null) {
        console.log('Target node not found');
        return;
      }
      let newNode = new _Node(val, currNode.next);
      currNode.next = newNode;
    }
    insertAt(val, position) {
      let count = 1;
      let currNode = this.head;
      while (count < position) {
        if (currNode.next === null) {
          console.log('Position out of current range');
          return;
        }
        count++;
        currNode = currNode.next;
      }
      currNode.next = new _Node(val, currNode.next);
    }
  }
  
  
  module.exports = SLL