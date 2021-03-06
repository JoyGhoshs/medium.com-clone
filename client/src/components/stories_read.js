import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Headroom from 'react-headroom';
import * as StoriesActions from '../actions';
import Editor, { composeDecorators } from 'draft-js-plugins-editor'
import { EditorState, convertFromRaw } from 'draft-js'
import { fromJS } from 'immutable';

import Header from './header';
import Navbar from './navbar';
import Comment from './comment';

 /* eslint-disable*/
import '../styles/last-draft/example.css'
import '../styles/last-draft/draft.css'

/* Emoji plugin */
import createEmojiPlugin from 'draft-js-emoji-plugin'
import 'draft-js-emoji-plugin/lib/plugin.css'
const emojiPlugin = createEmojiPlugin()
const { EmojiSuggestions } = emojiPlugin

/* Hashtag plugin */
import createHashtagPlugin from 'draft-js-hashtag-plugin'
import 'draft-js-hashtag-plugin/lib/plugin.css'
const hashtagPlugin = createHashtagPlugin()

/* Image with Alignment, dnd, focus, resize plugin */
import createImagePlugin from 'draft-js-image-plugin'
import createAlignmentPlugin from 'draft-js-alignment-plugin'
import createFocusPlugin from 'draft-js-focus-plugin'
import createResizeablePlugin from 'draft-js-resizeable-plugin'
import createDndPlugin from 'draft-js-drag-n-drop-plugin'

import 'draft-js-alignment-plugin/lib/plugin.css'
import 'draft-js-focus-plugin/lib/plugin.css'

const focusPlugin = createFocusPlugin()
const resizeablePlugin = createResizeablePlugin()
const dndPlugin = createDndPlugin()
const alignmentPlugin = createAlignmentPlugin()
const { AlignmentTool } = alignmentPlugin

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  dndPlugin.decorator
)
const imagePlugin = createImagePlugin({ decorator })

/* Linkify */
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import 'draft-js-linkify-plugin/lib/plugin.css'
const linkifyPlugin = createLinkifyPlugin()


/* Toolbar */
import createToolbarPlugin from 'last-draft-js-toolbar-plugin'
import 'last-draft-js-toolbar-plugin/lib/plugin.css'
const toolbarPlugin = createToolbarPlugin()
const { Toolbar } = toolbarPlugin

/* Side Toolbar */
import createSidebarPlugin from 'last-draft-js-sidebar-plugin'
import 'last-draft-js-sidebar-plugin/lib/plugin.css'
const sidebarPlugin = createSidebarPlugin()
const { Sidebar } = sidebarPlugin

/* Embed plugin */
import createEmbedPlugin from 'draft-js-embed-plugin'
import 'draft-js-embed-plugin/lib/plugin.css'
const embedPlugin = createEmbedPlugin()

/* Link plugin */
import createLinkPlugin from 'draft-js-link-plugin'
import 'draft-js-link-plugin/lib/plugin.css'
const linkPlugin = createLinkPlugin()

/* Color */
import {colorStyleMap} from 'draft-js-color-picker-plugin'

/* init the plugins */
const plugins = [
  dndPlugin, focusPlugin, alignmentPlugin, resizeablePlugin, imagePlugin,
  emojiPlugin, hashtagPlugin, linkifyPlugin, 
  toolbarPlugin, sidebarPlugin, embedPlugin, linkPlugin
]
  
/* eslint-enable*/



class StoriesRead extends Component {
	/* eslint-disable*/
	constructor() {
		super();
		this.state = { editorState : EditorState.createEmpty()}
	}
	 /* eslint-enable*/

	componentDidMount() {
		window.scrollTo(0, 0)
		const { id } = this.props.match.params
		this.props.readStory(id)
	}

	onChange = (editorState) => {
		this.setState({ editorState })

	}

	render() {
		const { story } = this.props;
		if(!story) {
			return <div>Loading...</div>;
		}

		const content = convertFromRaw(JSON.parse(story.content))
		return (
			<div>				
				<div className='container'>
					<h2>{JSON.parse(story.title).blocks[0].text}</h2>
					<h3>{story.author.username}</h3>
					<div>
						<Editor 
							editorState={EditorState.createWithContent(content)}
							onChange={this.onChange}
							readOnly={true}
							plugins={plugins}
						/>
					</div>					
				</div>
				<Comment story={story} />
			</div>
		)
	}
}


function mapStateToProps({ stories }, ownProps) {
	return { story: stories[ownProps.match.params.id] }
}

export default connect(mapStateToProps, StoriesActions)(StoriesRead)