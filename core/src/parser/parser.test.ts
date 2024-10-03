import { parse } from './parser';
import { Doc } from '../model/doc';

describe('parse', () => {
    it('should create a Doc instance with the given name', () => {
        const name = 'testDoc';
        const text = '';
        const doc = parse(name, text);
        expect(doc).toBeInstanceOf(Doc);
        expect(doc.name).toBe(name);
    });

    it('should ignore comment lines', () => {
        const name = 'testDoc';
        const text = '# This is a comment\n# Another comment';
        const doc = parse(name, text);
        expect(doc.root.children.length).toBe(0);
    });

    it('should process directive lines', () => {
        const name = 'testDoc';
        const text = `@setting autoNumber
        @setting test`;
        const doc = parse(name, text);
        expect(doc.root.directives.length).toBe(2);
    });

    it('should process node lines', () => {
        const name = 'testDoc';
        const text = `
        node1
          node2
        node3`;
        const doc = parse(name, text);
        expect(doc.root.children.length).toBe(2);
        expect(doc.root.children[0].children.length).toBe(1);
        expect(doc.root.children[1].children.length).toBe(0);
    });

    it('should handle mixed content', () => {
        const name = 'testDoc';
        const text = '# Comment\n@setting autoNumber\nnode1\n  node2\nnode3';
        const doc = parse(name, text);
        expect(doc.root.directives.length).toBe(1);
        expect(doc.root.children.length).toBe(2);
        expect(doc.root.children[0].children.length).toBe(1);
    });

    it('should report error if parse directive failed', () => {
        const name = 'testDoc';
        const text = '@setting';
        const doc = parse(name, text);
        expect(doc.errors.length).toBe(1);
    });
});
