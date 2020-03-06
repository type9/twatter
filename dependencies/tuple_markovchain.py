import copy

from dictogram import Dictogram
from custom_queue import Queue

class Node(Dictogram):
    def __init__(self, word):
        super(Node, self).__init__()
        self.phrase = word # the word that this node represents
    
    def walk(self): 
        '''chooses a node to walk to based off of sample'''
        return self.sample()

class MarkovChain():
    def __init__(self, order=2, starttoken='!START', stoptoken='!STOP'):
        self.order = order # number of orders to generate the chain with

        self.nodes = dict()
        self.starttokens = Dictogram()
        self.stoptokens = Dictogram()

        self.STARTTOKEN = starttoken
        self.STOPTOKEN = stoptoken
    
    def get_phrase(self, text_q):
        phrase = () # represent the n words seperated
        this_q = copy.copy(text_q)

        for i in range(self.order): # generates the 'phrase' based off of the order which dictates the number of words we look at
            this_word = (this_q.dequeue(),) # stores the word we're currently looking at
            
            phrase += this_word

        if self.STARTTOKEN in phrase:
            self.starttokens.add_count(phrase)
        return phrase

    def gen_nodes(self, text):
        '''iterates across list of words creating or modifying nodes'''
        text_q = Queue()
        for token in text:
            text_q.enqueue(token)

        while text_q.length() > self.order: # for each first word in the text we're analysing
            this_phrase = self.get_phrase(text_q)
            text_q.dequeue()
            next_phrase = self.get_phrase(text_q)

            if this_phrase in self.nodes.keys(): # if the phrase has already been added as a key
                if next_phrase:
                    self.nodes[this_phrase].add_count(next_phrase) # add a token of the next phrase
            else:
                self.nodes[this_phrase] = Node(this_phrase) # if not we create a new node
                if next_phrase:
                    self.nodes[this_phrase].add_count(next_phrase) # add a token of the next phrase

    def get_start(self):
        if self.order == 1:
            return self.nodes[(self.STARTTOKEN),].walk()
        return self.starttokens.sample()

    def gen_sentence(self):
        '''generates a sentence starting with a start token'''
        sentence = str()

        this_phrase = self.get_start() # start with the start token
    
        while not self.STOPTOKEN in this_phrase: # while we don't run into a stop token

            slice = self.order - 1

            sentence += ' '.join(this_phrase[slice:]) + ' ' # joins phrase (excluding the first word) into a string
            this_phrase = self.nodes[this_phrase].walk() # samples the current node for the next word

        if not self.order == 1:
            sentence += ' '.join(this_phrase[slice:1]) # joins phrase (exlcuding the last word) into a string

        return sentence
        

def main():
    import sys
    arguments = sys.argv[1:]

if __name__ == '__main__':
    main()