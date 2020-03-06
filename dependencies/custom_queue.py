from linkedlist import LinkedList

class Queue(LinkedList):
    
    def enqueue(self, item):
        self.append(item)
    
    def dequeue(self):
        if self.is_empty():
            raise ValueError('Cannot dequeue from an empty queue')

        item = self.head.data
        self.delete(item)
        return item