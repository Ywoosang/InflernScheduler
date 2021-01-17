from flask import (
    Flask,
    jsonify,
    render_template,
    redirect,
    url_for,
    request,
    abort,
    make_response
) 

from flask_wtf import FlaskForm 

# crawling
import requests
from bs4 import BeautifulSoup
from wtforms import StringField 
from wtforms.validators import DataRequired,URL
from flask_bootstrap import Bootstrap
 
app = Flask(__name__)
app.config['SECRET_KEY'] = b'\x88\x00p\xd4\x19(\x88\xe0\x13\x19\t\xe8d\xcc\x9a\xad'
Bootstrap(app)

class UrlForm(FlaskForm):
    url = StringField('URL',validators=[DataRequired('URL 형식으로 입력해 주세요'),URL()])


@app.route('/')
def index():
    return redirect(url_for('mainView'))


@app.route('/formcheck',methods=['GET','POST'])
def mainView():
    form = UrlForm()
    print(form.url)
    if form.validate_on_submit() : 
        url = form.url.data
        return render_template('result.html',url=url) 
    return render_template('index.html',form=form)



@app.route('/crawldata',methods=['POST']) 
def getResponseData():   
    try : 
        url = request.get_json()['url']
        print(request) 
        print(url)
        print('시작')
        
        res =requests.get(url)
        #  정보 
        soup = BeautifulSoup(res.content,'html.parser')
    except Exception as e:
        print(e) 
        return abort(403)

    try : 
        title = soup.select('div.info-content > div.title')[0].get_text()  
        sections = []
        section = None 
        # 전체 커리큘럼 
        curriculum = soup.find('div',class_='curriculum-list') 
        contents = curriculum.find_all('div')

        # section 생성해서 sections 에 첨가
        for content in contents : 
            if 'section-el' in content.attrs['class']:
                if section :
                    sections.append(section)
                section = {}
                section['name'] = content.get_text() 
                section['contents'] = [] 
            elif 'unit-el' in content.attrs['class']: 
                name = content.select('div.title-cover > div.title')[0].string
                time =  content.find('div',class_='unit-info').get_text().strip()
                content = {
                    'name' : name,
                    'time' : time
                } 
                section['contents'].append(content) 
                
        response = {
            'title' : title,
            'sections' : sections
        }
    except Exception as e: 
        print(e)
        return abort(403)
     
    return make_response(jsonify(response),200)

     

if __name__ == '__main__':
    app.run(debug=True) 
