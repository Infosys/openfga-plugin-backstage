import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, FormLabel, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { sendPermissionRequest, addPolicy, revokePolicy } from '../../client'; 
import Alert from '@material-ui/lab/Alert';

import { useApi, identityApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

const actionOptions = ['Read', 'Delete'];
const accessTypeOptions = ['owner', 'viewer'];

const useStyles = makeStyles({
  success: {
    color: 'green',
  },
  danger: {
    color: 'red',
  },
  info: {
    color: 'blue',
  },
  button: {
    width: '210px',
    height: '40px',
  },
  box: {
    width: '45%',
    minHeight: '300px',
  },
  alert: {
    minHeight: '100px',
    maxWidth : '40px',
  },
});

export const OpenfgaCatalogComponent = () => {
  const classes = useStyles();
  const [entities, setEntities] = useState<string[]>([]);
  const [user, setUser] = useState<string[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>(actionOptions[0]);
  const [selectedAccessType, setSelectedAccessType] = useState<string>(accessTypeOptions[0]);
  const [allowMessage, setAllowMessage] = useState<string>('');
  const [denyMessage, setDenyMessage] = useState<string>('');
  const [policyMessage, setPolicyMessage] = useState<string>('');
  const catalogApi = useApi(catalogApiRef);
  const identityApi = useApi(identityApiRef);
  const { fetch } = useApi(fetchApiRef);

  const handleEntityChange = (event: any) => {
    setSelectedEntity(event.target.value);
  };

  const handleActionChange = (event: any) => {
    setSelectedAction(event.target.value);
  };

  const handleAccessTypeChange = (event: any) => {
    setSelectedAccessType(event.target.value);
  };

  const fetchEntities = async () => {
    try {
      const { items } = await catalogApi.getEntities({ 
        fields: ['metadata.name'],
        filter: {
          kind: 'component',
        },
      });
      const entityNames = items.map((entity) => entity.metadata.name);
      const { ownershipEntityRefs } = await identityApi.getBackstageIdentity();
      setUser(ownershipEntityRefs);
      setEntities(entityNames);
      if (entityNames.length > 0) {
        setSelectedEntity(entityNames[0]);
      }
    } catch (error) {
      console.error('Error fetching catalog entities:', error);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  const handleActivatePolicy = async () => {
    const response = await sendPermissionRequest(fetch, selectedEntity, selectedAction, user);
    if (response.allowed) {
      setAllowMessage(`${user} Has permission to ${selectedAction} the ${selectedEntity}`);
    } else if (response.allowed && response.allowed == false){
      setDenyMessage(selectedAction === 'Read' ? 
      `${user} have permission only to ${selectedAction} the ${selectedEntity}` :
      `${user} Does not have permission to ${selectedAction} the ${selectedEntity}`);
    } else {
      setDenyMessage(response.message)
    }
    setTimeout(() => {
      setAllowMessage('');
      setDenyMessage('');
    }, 7000);
  };

  const handleAddPolicy = async () => {
    const response = await addPolicy(fetch, selectedEntity, selectedAccessType, user);
    if (Object.keys(response).length === 0 && response.constructor === Object){
      setPolicyMessage(selectedAccessType === 'owner' ? 
        'Added permission for user to read/delete the entity' :
        'Added permission for user to read not delete the entity');
    } else {
      setPolicyMessage(response.message);
    }
    setTimeout(() => {
      setPolicyMessage('');
    }, 7000);
  };

  const handleRevokePolicy = async () => {
    const response = await revokePolicy(fetch, selectedEntity, selectedAccessType, user);
    if (Object.keys(response).length === 0 && response.constructor === Object){
      setPolicyMessage(selectedAccessType === 'owner' ? 
        'Revoked permission for user to read/delete the entity' :
        'Revoked permission for user to read not delete the entity');
    } else {
      setPolicyMessage(response.message);
    }
    setTimeout(() => {
      setPolicyMessage('');
    }, 7000);
  };

  return (
    <Box sx={{ border: 1, borderRadius: 0, p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <Box className={classes.box}>
        <Typography className={classes.info} variant="body2" gutterBottom>
          {user}
        </Typography>
        <Typography variant="h6" gutterBottom>
          START EXISTING POLICY
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControl>
            <FormLabel>Select Entity</FormLabel>
            <Select
              value={selectedEntity}
              onChange={handleEntityChange}
              label="Select Entity"
            >
              {entities.map((entityName: string) => (
                <MenuItem key={entityName} value={entityName}>
                  {entityName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br/>
          <FormControl>
            <FormLabel>Select Action</FormLabel>
            <Select
              value={selectedAction}
              onChange={handleActionChange}
              label="Select Action"
            >
              {actionOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            className={`${classes.success} ${classes.button}`}
            variant="contained"
            onClick={handleActivatePolicy}
          >
            Check Policy
          </Button>
        </Box>
        {allowMessage && (
          <Alert severity="success" className={classes.alert}>{allowMessage}</Alert>
        )}
        {denyMessage && (
          <>
            {denyMessage.includes('Read') && (
              <Alert severity="success" className={classes.alert}>
              {user} have permission only to Read the {selectedEntity}
              </Alert>
            )}
            {denyMessage.includes('Delete') && (
              <Alert severity="error" className={classes.alert}>
                {user} Does not have permission to Delete the {selectedEntity}
              </Alert>
            )}
            {denyMessage.includes('invalid') && (
              <Alert severity="error" className={classes.alert}>
                {denyMessage}
              </Alert>
            )}
          </>
        )}
      </Box>

      <Box className={classes.box}>
        <Typography className={classes.info} variant="body2" gutterBottom>
          {user}
        </Typography>
        <Typography variant="h6" gutterBottom>
          MODIFY/ADD POLICY
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControl>
            <FormLabel>Select Entity</FormLabel>
            <Select
              value={selectedEntity}
              onChange={handleEntityChange}
              label="Select Entity"
            >
              {entities.map((entityName: string) => (
                <MenuItem key={entityName} value={entityName}>
                  {entityName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br/>
          <FormControl>
            <FormLabel>Select Access Type</FormLabel>
            <Select
              value={selectedAccessType}
              onChange={handleAccessTypeChange}
              label="Select Access Type"
            >
              {accessTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            className={`${classes.success} ${classes.button}`}
            variant="contained"
            onClick={handleAddPolicy}
          >
            Add Policy
          </Button>
          <Button
            className={`${classes.danger} ${classes.button}`}
            variant="contained"
            onClick={handleRevokePolicy}
          >
            Revoke Policy
          </Button>
        </Box>
        {policyMessage && (
          <Alert severity={policyMessage.includes('Added') ? 'success' : 'error'} className={classes.alert}>{policyMessage}</Alert>
        )}
      </Box>
    </Box>
  );
};

