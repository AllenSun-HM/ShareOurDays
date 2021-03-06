import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import {create} from './api-post.js'
import IconButton from '@material-ui/core/IconButton'
import PhotoCamera from '@material-ui/icons/PhotoCamera'

const useStyles = makeStyles(theme => ({
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  root: {
    backgroundColor: '#efefef',
    padding: `0px 0px 0px`
  },
  card: {
    maxWidth:600,
    margin: 'auto',
    marginBottom: theme.spacing(3),
    backgroundColor: 'add8e6',
    boxShadow: 'none'
  },
  cardContent: {
    backgroundColor: 'add8e6',
    paddingTop: 0,
    paddingBottom: 0
  },
  cardHeader: {
 
    paddingBottom: 8
  },
  photoButton: {
    position: 'relative',
    left: '85%',
    height: 30,
    marginBottom: 5
  },
  input: {
    display: 'none',
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: '90%'
  },
  submit: {
    margin: theme.spacing(2)
  },
  filename:{
    verticalAlign: 'super'
  }
}))

export default function NewPost (props){
  const classes = useStyles()
  const [values, setValues] = useState({
    text: '',
    image: '',
    error: '',
    user: {}
  })
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    setValues({...values, user: auth.isAuthenticated().user})
  }, [])


  const clickPost = async () => {
    let postData = new FormData()
    postData.append('text', values.text)
    postData.append('image', values.image)
    await create({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, postData).then(response => {
      let data = response.data
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, text:'', image: ''})
        props.addPost(data, props.posts, props.setPosts)
      }
    })
    console.log(values.image)
  }


  const handleChange = name => event => {
    const value = name === 'image'
      ? event.target.files[0]
      : event.target.value
    setValues({...values, [name]: value })
  }
  //values.user._id ?'https:/api/users/photo/'+ values.user._id :
  const photoURL =  '/api/users/defaultphoto'
  // const photoURL = 'https://s3.ap-northeast-2.amazonaws.com/mernsocial.img/Sat+Jan+16+2021+21%3A29%3A53+GMT%2B0800+(China+Standard+Time)'
    return (<div className={classes.root}>
      <Typography>
      <Card  className={classes.card}>
      <Typography type="title" className={classes.title}>
          Share Your Day
        </Typography>
      <CardHeader
            avatar={
              <Avatar src={photoURL}/>
            }
            title={values.user.name}
            className={classes.cardHeader}
          />
      <CardContent className={classes.cardContent}>
        <TextField
            placeholder="write here"
            multiline
            rows="3"
            value={values.text}
            onChange={handleChange('text')}
            className={classes.textField}
            margin="normal"
        />
        <input accept="image/*" onChange={handleChange('image')} className={classes.input} id="icon-button-file" type="file" />
        <label htmlFor="icon-button-file">
          <IconButton color="secondary" className={classes.photoButton} component="span">
            <PhotoCamera />
          </IconButton>
        </label> <span className={classes.filename}>{values.image ? values.image.name : ''}</span>
        { values.error && (<Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
              {values.error}
            </Typography>)
        }
      </CardContent>
      <CardActions>
        <Button color="primary" variant="contained" disabled={values.text === ''} onClick={clickPost} className={classes.submit}>POST</Button>
      </CardActions>
    </Card>
    </Typography>
  </div>)

}


