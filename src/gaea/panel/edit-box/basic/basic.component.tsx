import * as React from 'react'
import * as typings from './basic.type'
import {observer, inject} from 'mobx-react'
import * as classNames from 'classnames'

import {autoBindMethod} from '../../../../../../../common/auto-bind/src'
import {Button, ButtonGroup} from '../../../../../../button/src'
import {Checkbox} from '../../../../../../checkbox/src'
import Input from '../../../../../../input/src'

import RemoveButton from './remote-button/remote-button.component'
import SetGroupButton from './set-group-button/set-group-button.component'

import TextEditor from './edit-components/text/text.component'
import SelectEditor from './edit-components/select/select.component'
import SwitchEditor from './edit-components/switch/switch.component'
import ArrayEditor from './edit-components/array/array.component'
import MarginPaddingEditor from './edit-components/margin-padding/margin-padding.component'

import './basic.scss'

@inject('viewport', 'application') @observer
export default class EditBoxBasic extends React.Component <typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    // 当前编辑组件的信息
    private componentInfo: FitGaea.ViewportComponentInfo

    /**
     * 重置为默认属性
     */
    @autoBindMethod resetOptions() {
        this.props.viewport.resetComponent(this.props.viewport.currentEditComponentMapUniqueKey)
    }

    /**
     * 修改组件标题
     */
    @autoBindMethod handleChangeName(event: any) {
        this.componentInfo.props.gaeaName = event.target.value
    }

    /**
     * 给标题输入框右侧增加删除按钮
     */
    @autoBindMethod titleInputRightRender() {
        // 根组件没有移除功能
        if (this.componentInfo.parentMapUniqueKey === null) {
            return null
        }

        return (
            <RemoveButton/>
        )
    }

    /**
     * 修改一个字段是否生效
     */
    handleToggleOptionEnable(editOption: FitGaea.ComponentPropsGaeaEdit, checked: boolean) {
        editOption.isNull = !checked
        if (!checked) {
            // 暂存非空的值
            editOption.notNullValue = this.componentInfo.props[editOption.field]
            this.props.viewport.updateComponentOptionsValue(editOption, null)
        } else {
            this.props.viewport.updateComponentOptionsValue(editOption, editOption.notNullValue)
        }
    }

    render() {
        if (!this.props.viewport.currentEditComponentMapUniqueKey) {
            return null
        }

        // 绑定组件信息
        this.componentInfo = this.props.viewport.components.get(this.props.viewport.currentEditComponentMapUniqueKey)

        const Editors = this.componentInfo.props.gaeaEdit && this.componentInfo.props.gaeaEdit.map((editOption, index)=> {
                const key = `${this.props.viewport.currentEditComponentMapUniqueKey}-${editOption.field}`

                let EditElement: React.ReactElement<any> = null

                switch (editOption.editor) {
                    case 'text':
                        EditElement = (
                            <TextEditor editOption={editOption}/>
                        )
                        break
                    case 'selector':
                        EditElement = (
                            <SelectEditor editOption={editOption}/>
                        )
                        break
                    case 'switch':
                        EditElement = (
                            <SwitchEditor editOption={editOption}/>
                        )
                        break
                    case 'array':
                        EditElement = (
                            <ArrayEditor editOption={editOption}/>
                        )
                        break
                    case 'marginPadding':
                        EditElement = (
                            <MarginPaddingEditor editOption={editOption}/>
                        )
                        break
                }

                const editLineLabelClasses = classNames({
                    'edit-line-label': true,
                    'disabled': editOption.isNull
                })

                return (
                    <div key={key}
                         className="edit-line-container">
                        <div className={editLineLabelClasses}>
                            {editOption.canNull &&
                            <Checkbox checked={!editOption.isNull}
                                      onChange={this.handleToggleOptionEnable.bind(this, editOption)}/>
                            }
                            {editOption.label}
                        </div>
                        <div className="edit-line-editor">
                            {EditElement}
                        </div>
                    </div>
                )
            })

        // 重置按钮,非根节点才有
        let ResetButton: React.ReactElement<any> = null
        if (this.componentInfo.parentMapUniqueKey !== null) {
            ResetButton = (
                <Button onClick={this.resetOptions}>重置</Button>
            )
        }

        // 成组按钮,有 childs 的 layout 元素且非根节点才有
        let GroupButton: React.ReactElement<any> = null
        if (this.componentInfo.props.gaeaUniqueKey === 'gaea-layout' && this.componentInfo.parentMapUniqueKey !== null) {
            GroupButton = (
                <SetGroupButton/>
            )
        }

        return (
            <div className="_namespace">
                <div className="basic-title-container">
                    <div className="component-icon-container">
                        <i className={`fa fa-${this.componentInfo.props.gaeaIcon}`}/>
                    </div>
                    <Input className="title-name"
                           label="组件名"
                           key={this.props.viewport.currentEditComponentMapUniqueKey}
                           onChange={this.handleChangeName}
                           rightRender={this.titleInputRightRender}
                           value={this.componentInfo.props.gaeaName}/>
                </div>

                <div className="edit-item-container">
                    {Editors}
                </div>
                <div className="bottom-addon">
                    <ButtonGroup>
                        {ResetButton}
                        {GroupButton}
                    </ButtonGroup>
                </div>
            </div>
        )
    }
}