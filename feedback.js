const Feedback = {
	init: function() {
		let frm = $('.form-feedback');
		let btnsend = frm.find('.btn');
		btnsend.on('click', _=> this.send(frm));
	},
	send: function(frm) {
		let inputs = frm.find('[name]');
		let data = [];
		let error = false;
		let _this = this;
		inputs.each(function() {
			let val = $(this).val().trim();

			if($(this).attr('required') && !val) {
				if(!error) $(this).focus();
				error = true;
				$(this).addClass('error');
				//return false;
			}

			//if($(this).attr('name') === 'agreement' && !$(this).is(':checked')) val = 'Нет';

			data.push({
				name: $(this).attr('name'),
				value: val
			});
		});

		if(error) {
			setTimeout(function () { alert('В форме содержатся ошибки!'); }, 100);
			//Внимание! Заполните пожалуйста все поля.

			return false;
		}

		$.ajax({
			url: '/feedback-order',
			method: 'post',
			dataType: 'json',
			data: data,
			timeout: 20000,

			beforeSend: function(){
				_this.overlay(true);
			},

			error: function(obj,status) {
				//alert(status);
				_this.overlay(false);
			},

			success: function(response) {
				if(response.data) {

					if (response.data.text) {
						inputs.each(function() {
							$(this).removeClass('error');
							$(this).val('');
						});
						$('.form-feedback').append('<div class="success">'+response.data.text+'</div>');
					}

					if (response.data.error) {
						alert(response.data.error);
					}

				} else {

				}

				_this.overlay(false);
			},

			complete: function() {

			},

			statusCode: {

			}
		});
	},

	overlay: function(show) {
		if(show) {
			if(!$('.overlay').is(':visible')) $('.form-feedback').append('<div class="overlay"><i class="spinner"></i></div>');
		} else {
			$('.overlay').remove();
		}
	},
};

export default Feedback;



//'Настоящим подтверждаю, что я ознакомлен и согласен с условиями политики конфиденциальности'
//Я согласен на обработку моих персональных данных согласно закону № 152-ФЗ
//Я согласен на обработку персональных данных
