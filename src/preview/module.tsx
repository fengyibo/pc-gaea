import * as React from 'react'

export interface PropsInterface {
    /**
     * 外部提供编辑组件
     */
    components?: Array<React.Component<any ,any>>

    /**
     * 页面初始化信息
     */
    pageInfo?: any
}

export class Props implements PropsInterface {

}

export interface StateInterface {

}

export class State implements StateInterface {

}