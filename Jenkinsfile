def destination = '/var/www/html/adminportal'
node {


      stage('scm checkout'){
          checkout scm
      }
      stage('clean'){


            try
            {
              sh "rm -r ${destination}"

            }
            catch (exc) {
              echo 'Something failed, I should sound the klaxons!'
            }


        }

      stage('build') {

              sh 'npm install'
              sh 'npm run build-server'


      }

        stage('staging'){

            sh "cp -r dist ${destination}"

        }

}
