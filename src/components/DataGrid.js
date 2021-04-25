import { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Modal from './ConfirmationModal'

import LinearProgress from '@material-ui/core/LinearProgress'
import Snackbar from './Snackbar'

import dataService from '../services/dataService'
import { formatData, getPermissions } from '../helpers/helpers'

const getPostColumns = (darkMode) => {
    return [
        { field: 'postNum', headerName: 'Post Num', width: 140 },
        { 
            field: 'imageURL', 
            headerName: 'Image URL', width: 200,
            renderCell: (params) => (
                <a href={params.value} rel="noreferrer" target="_blank" style={{color: darkMode ? '#809fff' : '#0000EE'}}>
                {params.value}
                </a>
            ),
        },
        { field: 'text', headerName: 'text', width: 220 },
        { field: 'date', headerName: 'Date', width: 220 }
    ];
}

// could put two in a function
const adminColumns = [
    { field: 'username', headerName: 'Username', width: 140 },
    { field: 'permissions', headerName: 'Permissions', width: 150 },
    { field: 'commentsDeleted', headerName: 'Comments Deleted', width: 180 },
    { field: 'threadsDeleted', headerName: 'Threads Deleted', width: 180 },
    { field: 'totalDeleted', headerName: 'Total Posts Deleted', width: 200 },
    { field: 'lastDeletionDate', headerName: 'Last Deletion Date', width: 170 }
];


const DeleteDataGrid = ({ postType, darkMode }) => {
    const [ rows, setRows ] = useState([])
    const [ select, setSelection ] = useState([]);
    const [ showDeleteButton, setShowDeleteButton ] = useState(false);
    const [ showModal, setShowModal ] = useState(false);
    const [ showProgressBar, setShowProgressBar ] = useState(false);
    const [ dataLoaded, setDataLoaded ] = useState(false)
    const [ snackbarState, setSnackbarState ] = useState({
        show: false, 
        severity: 'success',
        message: ''
    });
    const permissions = getPermissions()
   
    let columns = []
    
    if(postType === 'threads' || postType === 'comments')
        columns = getPostColumns(darkMode)
    else if(postType === 'admins')
        columns = adminColumns

    // console.log('rows', rows)

    const getDataHook = () => {
        const getData = async () => {
            let data = {}

            switch(postType) {
                case 'threads':
                    data = await dataService.getThreads()
                    break
                case 'comments':
                    data = await dataService.getComments()
                    break
                case 'admins':
                    data = await dataService.getAdmins()
                    break
            }
            
            data = data.data
            console.log('data from threads', data)
            data = formatData(data, postType)
            setDataLoaded(true)
            setRows(data)
        }
        getData()
    }

    const handleButtonClick = () => {
        setShowModal(!showModal)
    }

    const handleModalClose = () => {
        setShowModal(!showModal)
    }

    const handleConfirmation = async () => {
        let newRows = []

        // if all rows are selected, then delete them
        if(rows.length === select.length)
            newRows = []  
        else {
            newRows = rows.filter(row => {
                return !select.includes(row.id.toString())
            })
        }

        // the threads to be deleted
        let postNums = []
        if(postType === 'admins') {
            // in this case postNums will be the usernames of the selected rows
            postNums = select
        }
        else {
            postNums = select.map(selectedRow => parseInt(selectedRow))
        }

        // send api call here
        try {
            setShowModal(!showModal)
            setShowProgressBar(true)
            
            switch(postType) {
                case 'threads':
                    await dataService.deleteThreads(postNums)
                    break
                case 'comments':
                    await dataService.deleteComments(postNums)
                    break
                case 'admins':
                    await dataService.deleteAdmins(postNums)
                    break
            }

            setSnackbarState({
                show: true,
                severity: 'success',
                message: 'Deletion successful'
            })
            setSelection([])
            setRows(newRows)
            setShowDeleteButton(!showDeleteButton)
        }
        catch(err) {
            setSnackbarState({
                show: true,
                severity: 'error',
                message: 'Error occured during deletion.\nRefresh page to see successful deletions'
            })
        }
        
        setShowProgressBar(false)
    }

    const handleSnackbarClose = () => {
        setSnackbarState({...snackbarState, show: !snackbarState.show})
    }

    useEffect(getDataHook, [postType])

    return (
        <>
                    <div style={{ height: '700px', width: '100%' }}>
                        <h2>Select {`${postType}`} for deletion</h2>
                        <LinearProgress style={{height: '10px', display: showProgressBar ? '' : 'none'}} />
                        <DataGrid 
                            loading={dataLoaded ? false : true}
                            rows={rows} 
                            columns={columns} 
                            pageSize={50}
                            checkboxSelection={permissions === 'view' ? false : true}
                            onSelectionModelChange={({ selectionModel }) => {
                                setSelection(selectionModel)
                                if(selectionModel.length) {
                                    setShowDeleteButton(true)
                                }
                                else {
                                    setShowDeleteButton(false)
                                }
                            }}
                        />
                        <Button style={{display: showDeleteButton ? '' : 'none'}} variant="contained" color="secondary" onClick={handleButtonClick}>
                            Delete
                        </Button>
                        
                        <Modal 
                            showModal={showModal} 
                            handleModalClose={handleModalClose} 
                            handleConfirmation={handleConfirmation}
                        >
                        </Modal>

                        <Snackbar
                            showSnackbar={snackbarState.show}
                            message={snackbarState.message}
                            severity={snackbarState.severity}
                            handleSnackbarClose={handleSnackbarClose}
                        >
                        </Snackbar>
                    </div>
        </>
    );
}

export default DeleteDataGrid