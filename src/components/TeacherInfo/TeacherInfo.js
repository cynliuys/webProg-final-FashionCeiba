import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import dp1 from '../../images/developer1.jpg'
import dp2 from '../../images/developer2.jpg'
import dp3 from '../../images/developer3.jpg'
import EmailIcon from '@material-ui/icons/Mail'
import SchoolIcon from '@material-ui/icons/School'

export default function MediaCard() {
  return (
    <div>
    <Card style={{height:'85%',  width:'20%',left:'15%', top:'15%',position: "absolute"}}>
      <CardActionArea style={{height:'100%'}}>
        <CardMedia
          component="img"
          image={dp1}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Jackson Hsieh
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
                <SchoolIcon style={{marginRight:'3%'}} />
                National Taiwan University
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
                <EmailIcon  style={{marginRight:'3%'}}/>
                b04901020@ntu.edu.tw
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>

    <Card style={{height:'85%', width:'20%', left:'40%',top:'15%',position: "absolute"}}>
      <CardActionArea style={{height:'100%'}}>
        <CardMedia
          component="img"
          image={dp2}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Cynthia Liu 
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
                <SchoolIcon style={{marginRight:'3%'}} />
                National Taiwan University
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
                <EmailIcon  style={{marginRight:'3%'}}/>
                b04901152@ntu.edu.tw
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    <Card style={{height:'85%',  width:'20%',left:'65%',top:'15%',position: "absolute"}}>
      <CardActionArea style={{height:'100%'}}>
        <CardMedia
          component="img"
          image={dp3}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Pierre Su
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
                <SchoolIcon style={{marginRight:'3%'}} />
                National Taiwan University
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
                <EmailIcon  style={{marginRight:'3%'}}/>
                b04901070@ntu.edu.tw
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    </div>
  );
}