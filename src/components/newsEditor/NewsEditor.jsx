import React,{useState,useEffect} from 'react'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './NewsEditor.less'

export default function NewsEditor(props) {
   const [editorState, setEditorState] = useState()

   useEffect(() => {
      // html ---> draft
      const html = props.content
      if(html === undefined) return
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState)
      }
   }, [props.content])

    return (
       <div className="editor">
            <Editor
            editorState={editorState}
            toolbarClassName="toolbar"
            wrapperClassName="wrapper"
            editorClassName="editor"
            onEditorStateChange={editorState => setEditorState(editorState)}
            onBlur={() => {
               props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
            }}
        />
       </div>
    )
}
