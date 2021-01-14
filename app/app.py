from flask import (
    Flask,
    make_response,
    jsonify,
    render_template,
    redirect,
    url_for,
    request,
    abort
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
    url = StringField('URL',validators=[DataRequired(),URL()])


@app.route('/')
def index():
    return redirect(url_for('mainView'))


@app.route('/InflearnScheduler',methods=['POST','GET'])
def mainView():
    form = UrlForm()
    print(form.url)
    if request.method == 'POST' and form.validate_on_submit() : 
        try : 
            url = form.url.data
            print(url)
            res =requests.get(url)
            #  정보 
            soup = BeautifulSoup(res.content,'html.parser')
        except Exception as e:
            print(e) 
            return abort(404)

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
            return abort(404)

        return render_template('result.html',title=response['title'],sections=response['sections'],form=form) 
    return render_template('index.html',form=form)

if __name__ == '__main__':
    app.run(debug=True) 
