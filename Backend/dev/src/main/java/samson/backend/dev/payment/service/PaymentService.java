package samson.backend.dev.payment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import samson.backend.dev.payment.API.PaymentExternalInterface;
import samson.backend.dev.payment.API.PaymentInternalInterface;
import samson.backend.dev.payment.repository.PaymentRepo;
@Service
class PaymentService implements PaymentExternalInterface, PaymentInternalInterface {

    @Autowired
    private PaymentRepo PaymentRepo;
}
