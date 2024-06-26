import { Document } from 'docxyz';
import { docxContext } from "./docxContext";
import { saveDocx, toEditorData } from './trans';

const withDocx = (editor) => {
    editor.docxContext = docxContext;
    editor.getCssClass = (name) => {
        return docxContext.getCssClass(name);
    };
    editor.getFont = (name) => {
        return docxContext.getFont(name);
    };
    editor.getFontStyle = (name) => {
        return docxContext.getFontStyle(name);
    };
    editor.getFormat = (name) => {
        return docxContext.getFormat(name);
    };
    editor.getFormatStyle = (name) => {
        return docxContext.getFormatStyle(name);
    };
    editor.getTableFormat = (name) => {
        return docxContext.getTableFormat(name);
    };
    editor.getTableFormatStyle = (name) => {
        return docxContext.getTableFormatStyle(name);
    };
    editor.getGlobalStyleObj = (className) => {
        return docxContext.getGlobalStyleObj(className);
    };
    editor.getParagraphStyles = () => {
        return docxContext.paragraphStyles;
    }
    editor.getSectionStyle = (key) => {
        return docxContext.sectionMap?.getSectionStyle(key);
    }
    editor.loadDocx = (buffer) => {
        let docx;
        try {
            docx = new Document(Buffer.from(buffer));
        } catch (e) {
            alert(e);
            return;
        }
        console.log('docx file', docx);
        console.time('load')
        docxContext.loadDocx(docx);
        console.timeEnd('load');
        console.time('transform')
        let data = toEditorData(docxContext);
        console.timeEnd('transform');
        console.log(data);
        editor.children = data;
        editor.onChange();

    };
    editor.saveDocx = () => {
        return saveDocx(docxContext, editor.children);
    }
    return editor;
};

export { withDocx };

