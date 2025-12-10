package samson.backend.dev.subscription.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import samson.backend.dev.subscription.API.SubscriptionExternalInterface;
import samson.backend.dev.subscription.API.SubscriptionInternalInterface;
import samson.backend.dev.subscription.repository.SubscriptionRepo;

@Service
public class SubscriptionService implements SubscriptionInternalInterface,SubscriptionExternalInterface{
    @Autowired
    private SubscriptionRepo subscriptionRepo;
}
