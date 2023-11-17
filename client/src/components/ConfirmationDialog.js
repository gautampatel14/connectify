// ConfirmationDialog.js
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const ConfirmationDialog = ({ isOpen, onRequestClose, onConfirm }) => {
    return (
        <Dialog open={isOpen} onClose={onRequestClose}>
            <DialogTitle>Delete Account </DialogTitle>
            <DialogContent>
                <p>Are you sure you want to delete your account?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onRequestClose} color="primary">
                    No
                </Button>
                <Button onClick={onConfirm} color="primary">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
