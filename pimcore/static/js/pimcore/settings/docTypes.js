/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Enterprise License (PEL)
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 * @copyright  Copyright (c) 2009-2016 pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GPLv3 and PEL
 */

pimcore.registerNS("pimcore.settings.document.doctypes");
pimcore.settings.document.doctypes = Class.create({

    initialize: function () {

        this.getTabPanel();
    },

    activate: function () {
        var tabPanel = Ext.getCmp("pimcore_panel_tabs");
        tabPanel.activate("pimcore_document_types");
    },

    getTabPanel: function () {

        if (!this.panel) {
            this.panel = new Ext.Panel({
                id: "pimcore_document_types",
                title: t("document_types"),
                iconCls: "pimcore_icon_doctypes",
                border: false,
                layout: "fit",
                closable:true,
                items: [this.getRowEditor()]
            });

            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.activate("pimcore_document_types");


            this.panel.on("destroy", function () {
                pimcore.globalmanager.remove("document_types");
            }.bind(this));

            pimcore.layout.refresh();
        }

        return this.panel;
    },

    getRowEditor: function () {

        this.store = pimcore.globalmanager.get("document_types_store");
        var documentDocumentTypeStore = pimcore.globalmanager.get("document_documenttype_store");

        var typesColumns = [
            {header: t("name"), width: 100, sortable: true, dataIndex: 'name',
                                                                        editor: new Ext.form.TextField({})},
            {header: t("module_optional"), width: 50, sortable: true, dataIndex: 'module',
                                                                        editor: new Ext.form.TextField({})},
            {header: t("controller"), width: 50, sortable: true, dataIndex: 'controller',
                                                                        editor: new Ext.form.TextField({})},
            {header: t("action"), width: 50, sortable: true, dataIndex: 'action',
                                                                        editor: new Ext.form.TextField({})},
            {header: t("template"), width: 50, sortable: true, dataIndex: 'template',
                                                                        editor: new Ext.form.TextField({})},
            {header: t("type"), width: 50, sortable: true, dataIndex: 'type',
                                                                        editor: new Ext.form.ComboBox({
                triggerAction: 'all',
                editable: false,
                store: documentDocumentTypeStore
            })},
            {header: t("priority"), width: 50, sortable: true, dataIndex: 'priority', editor: new Ext.form.ComboBox({
                store: [1,2,3,4,5,6,7,8,9,10],
                mode: "local",
                triggerAction: "all"
            })},
            {header: t("creationDate"), sortable: true, dataIndex: 'creationDate', editable: false, width: 130,
                hidden: true,
                renderer: function(d) {
                    if (d !== undefined) {
                        var date = new Date(d * 1000);
                        return date.format("Y-m-d H:i:s");
                    } else {
                        return "";
                    }
                }
            },
            {header: t("modificationDate"), sortable: true, dataIndex: 'modificationDate', editable: false, width: 130,
                hidden: true,
                renderer: function(d) {
                    if (d !== undefined) {
                        var date = new Date(d * 1000);
                        return date.format("Y-m-d H:i:s");
                    } else {
                        return "";
                    }
                }
            },
            {
                xtype: 'actioncolumn',
                width: 10,
                items: [{
                    tooltip: t('delete'),
                    icon: "/pimcore/static/img/icon/cross.png",
                    handler: function (grid, rowIndex) {
                        grid.getStore().removeAt(rowIndex);
                    }.bind(this)
                }]
            },{
                xtype: 'actioncolumn',
                width: 10,
                items: [{
                    tooltip: t('translate'),
                    icon: "/pimcore/static/img/icon/translation.png",
                    handler: function(grid, rowIndex){
                        var rec = grid.getStore().getAt(rowIndex);
                        try {
                            pimcore.globalmanager.get("translationadminmanager").activate(rec.data.name);
                        }
                        catch (e) {
                            pimcore.globalmanager.add("translationadminmanager",
                                                    new pimcore.settings.translation.admin(rec.data.name));
                        }
                    }.bind(this)
                }]
            }
        ];

        this.grid = new Ext.grid.EditorGridPanel({
            frame: false,
            autoScroll: true,
            store: this.store,
            columns : typesColumns,
            columnLines: true,
            trackMouseOver: true,
            stripeRows: true,
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            tbar: [
                {
                    text: t('add'),
                    handler: this.onAdd.bind(this),
                    iconCls: "pimcore_icon_add"
                }
            ],
            viewConfig: {
                forceFit: true
            }
        });

        return this.grid;
    },

    onAdd: function (btn, ev) {
        var u = new this.grid.store.recordType({
            name: t('new_document_type'),
            type: "page"
        });
        this.grid.store.insert(0, u);
    }
});